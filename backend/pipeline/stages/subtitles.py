from pathlib import Path
from pipeline.context import PipelineContext, StoryboardContract
from pipeline.media.audio import build_srt


def run_subtitles_stage(ctx: PipelineContext, contract: StoryboardContract) -> Path:
    out = ctx.audio_dir / "subtitles_en.srt"
    out.write_text(build_srt(contract.shots), encoding="utf-8")
    return out
