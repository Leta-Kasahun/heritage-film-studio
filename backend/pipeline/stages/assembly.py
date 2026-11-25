from pathlib import Path
from pipeline.context import PipelineContext, StoryboardContract
from pipeline.media.ffmpeg import assemble_film

ASPECT_DIMENSIONS: dict[str, tuple[int, int]] = {
    "16:9": (1280, 720),
    "9:16": (720, 1280),
}


def run_assembly_stage(
    ctx: PipelineContext,
    contract: StoryboardContract,
    clips: list[Path],
    narrations: list[Path],
    music_path: Path,
    srt_path: Path,
    aspect_ratio: str = "16:9",
) -> Path:
    width, height = ASPECT_DIMENSIONS.get(aspect_ratio, (1280, 720))
    tag = aspect_ratio.replace(":", "x")
    out = ctx.video_dir / f"final_{tag}.mp4"
    return assemble_film(
        clip_paths=clips,
        narration_paths=narrations,
        music_path=music_path,
        srt_path=srt_path,
        end_card_text=contract.end_card_text,
        out_path=out,
        width=width,
        height=height,
    )
