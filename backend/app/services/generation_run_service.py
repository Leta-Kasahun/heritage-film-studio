import uuid
from datetime import datetime, timezone
from pathlib import Path
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.exceptions import NotFoundException
from app.db.models.generation_run import GenerationRun
from app.db.session import SessionLocal
from app.repositories.asset_repository import AssetRepository
from app.repositories.generation_run_repository import GenerationRunRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.shot_repository import ShotRepository
from app.schemas.asset import AssetCreate
from app.schemas.generation_run import GenerationRunCreate
from app.schemas.project import ProjectUpdate
from app.schemas.shot import ShotCreate
from pipeline.context import PipelineContext
from pipeline.stages.assembly import ASPECT_DIMENSIONS, run_assembly_stage
from pipeline.stages.keyframes import run_keyframes_stage
from pipeline.stages.music import run_music_stage
from pipeline.stages.narration import run_narration_stage
from pipeline.stages.script import run_script_stage
from pipeline.stages.shots import run_shots_stage
from pipeline.stages.storyboard import run_storyboard_stage
from pipeline.stages.subtitles import run_subtitles_stage

STAGE_META: dict[str, tuple[str, str]] = {
    "script":     ("google", "gemini-3.8-flash"),
    "storyboard": ("google", "gemini-3.8-flash"),
    "keyframes":  ("cloudflare", "@cf/black-forest-labs/flux-1-schnell"),
    "narration":  ("google", "gemini-3.8-flash-tts"),
    "music":      ("ffmpeg", "acestep-or-ambient"),
    "assembly":   ("ffmpeg", "h264-aac-loudnorm"),
}


class GenerationRunService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.run_repo = GenerationRunRepository(db)
        self.project_repo = ProjectRepository(db)

    def create_stage_run(self, project_id: uuid.UUID, stage: str) -> GenerationRun:
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise NotFoundException("Project", project_id)
        provider, model = STAGE_META.get(stage, ("internal", stage))
        return self.run_repo.create(
            GenerationRunCreate(
                project_id=project_id,
                stage=stage,
                provider=provider,
                model=model,
                status="running",
                started_at=datetime.now(timezone.utc),
            )
        )


def _register_asset(
    db: Session,
    project_id: uuid.UUID,
    run_id: uuid.UUID,
    file_path: Path,
    asset_type: str,
    role: str,
    mime_type: str,
    width_px: int | None = None,
    height_px: int | None = None,
) -> None:
    storage_root = get_settings().STORAGE_DIR.resolve()
    object_key = file_path.resolve().relative_to(storage_root).as_posix()
    AssetRepository(db).create(
        AssetCreate(
            project_id=project_id,
            generation_run_id=run_id,
            asset_type=asset_type,
            role=role,
            storage_provider="local",
            bucket="storage",
            object_key=object_key,
            mime_type=mime_type,
            size_bytes=file_path.stat().st_size,
            width_px=width_px,
            height_px=height_px,
        )
    )


def execute_stage_task(run_id: uuid.UUID, project_id: uuid.UUID, stage: str) -> None:
    db = SessionLocal()
    run_repo = GenerationRunRepository(db)
    project_repo = ProjectRepository(db)
    run = run_repo.get_by_id(run_id)
    project = project_repo.get_by_id(project_id)
    if not run or not project:
        db.close()
        return

    ctx = PipelineContext(
        project_id=str(project.id),
        aspect_ratios=project.settings.get("aspect_ratios", ["16:9", "9:16"]),
    )

    try:
        output_data: dict = {}
        if stage == "script":
            project_repo.update_status(project, "generating_script")
            script_path = run_script_stage(
                ctx,
                topic=project.heritage_topic or project.title,
                source_text=project.script_text or project.description or project.title,
                language_code=project.language_code,
            )
            script_text = script_path.read_text(encoding="utf-8")
            project_repo.update(project, ProjectUpdate(script_text=script_text, status="uploaded"))
            output_data = {"script_chars": len(script_text)}

        elif stage == "storyboard":
            project_repo.update_status(project, "generating_storyboard")
            contract = run_storyboard_stage(
                ctx,
                script_text=project.script_text or project.description or project.title,
                language_code=project.language_code,
            )
            shot_repo = ShotRepository(db)
            for s in contract.shots:
                shot_repo.create(
                    ShotCreate(
                        project_id=project.id,
                        shot_number=s.index + 1,
                        title=s.description[:180],
                        duration_seconds=s.duration_s,
                        narration_text=s.narration_text,
                        subtitle_text=s.narration_en,
                        visual_prompt=s.image_prompt,
                    )
                )
            output_data = {"shots": len(contract.shots)}

        elif stage == "keyframes":
            project_repo.update_status(project, "generating_keyframes")
            contract = ctx.load_storyboard()
            images = run_keyframes_stage(ctx, contract)
            for img in images:
                _register_asset(db, project.id, run.id, img, "image", "keyframe", "image/png", 1280, 720)
            output_data = {"keyframes": len(images)}

        elif stage == "narration":
            project_repo.update_status(project, "generating_narration")
            contract = ctx.load_storyboard()
            wavs = run_narration_stage(ctx, contract)
            for wav in wavs:
                _register_asset(db, project.id, run.id, wav, "audio", "narration", "audio/wav")
            output_data = {"narrations": len(wavs)}

        elif stage == "music":
            project_repo.update_status(project, "generating_music")
            contract = ctx.load_storyboard()
            music = run_music_stage(ctx, contract)
            _register_asset(db, project.id, run.id, music, "audio", "score", "audio/wav")
            output_data = {"music": music.name}

        elif stage == "assembly":
            project_repo.update_status(project, "assembling")
            contract = ctx.load_storyboard()
            keyframes = sorted(ctx.keyframes_dir.glob("shot_*.png"))
            narrations = sorted(ctx.audio_dir.glob("shot_*.wav"))
            music = run_music_stage(ctx, contract)
            srt = run_subtitles_stage(ctx, contract)
            outputs: list[str] = []
            for ratio in ctx.aspect_ratios:
                w, h = ASPECT_DIMENSIONS.get(ratio, (1280, 720))
                clips = run_shots_stage(ctx, contract, keyframes, width=w, height=h)
                final_mp4 = run_assembly_stage(ctx, contract, clips, narrations, music, srt, ratio)
                _register_asset(db, project.id, run.id, final_mp4, "video", f"final_{ratio}", "video/mp4", w, h)
                outputs.append(final_mp4.name)
            project_repo.update_status(project, "done")
            output_data = {"videos": outputs}

        run_repo.mark_completed(run, status="succeeded", output_data=output_data)
    except Exception as exc:
        project_repo.update_status(project, "error")
        run_repo.mark_completed(run, status="failed", error_message=str(exc))
    finally:
        db.close()
