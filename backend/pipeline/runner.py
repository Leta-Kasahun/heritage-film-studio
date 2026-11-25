import argparse
from pathlib import Path
from pipeline.context import PipelineContext
from pipeline.stages.assembly import ASPECT_DIMENSIONS, run_assembly_stage
from pipeline.stages.keyframes import run_keyframes_stage
from pipeline.stages.music import run_music_stage
from pipeline.stages.narration import run_narration_stage
from pipeline.stages.shots import run_shots_stage
from pipeline.stages.subtitles import run_subtitles_stage


def run_from_storyboard(
    storyboard_path: Path,
    project_id: str = "default",
    aspect_ratios: list[str] | None = None,
) -> dict[str, Path]:
    ctx = PipelineContext(
        project_id=project_id,
        aspect_ratios=aspect_ratios or ["16:9", "9:16"],
    )
    contract = ctx.load_storyboard(storyboard_path)
    keyframes = run_keyframes_stage(ctx, contract)
    narrations = run_narration_stage(ctx, contract)
    music_path = run_music_stage(ctx, contract)
    srt_path = run_subtitles_stage(ctx, contract)

    exports: dict[str, Path] = {}
    for ratio in ctx.aspect_ratios:
        width, height = ASPECT_DIMENSIONS.get(ratio, (1280, 720))
        clips = run_shots_stage(ctx, contract, keyframes, width=width, height=height)
        exports[ratio] = run_assembly_stage(
            ctx=ctx,
            contract=contract,
            clips=clips,
            narrations=narrations,
            music_path=music_path,
            srt_path=srt_path,
            aspect_ratio=ratio,
        )
    return exports


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Heritage Film Studio pipeline")
    parser.add_argument("--storyboard", type=Path, required=True)
    parser.add_argument("--project-id", type=str, default="cli-film")
    parser.add_argument("--ratios", nargs="+", default=["16:9", "9:16"])
    args = parser.parse_args()

    exports = run_from_storyboard(
        storyboard_path=args.storyboard,
        project_id=args.project_id,
        aspect_ratios=args.ratios,
    )
    for ratio, out in exports.items():
        print(f"{ratio}: {out}")


if __name__ == "__main__":
    main()
