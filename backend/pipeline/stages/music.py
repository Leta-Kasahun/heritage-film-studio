from pathlib import Path
from pipeline.context import (
    PipelineContext,
    StoryboardContract,
    compute_hash,
    is_cached,
    write_cache_hash,
)
from pipeline.media.ffmpeg import generate_ambient_score


def run_music_stage(ctx: PipelineContext, contract: StoryboardContract) -> Path:
    custom_score = ctx.audio_dir / "score_acestep.wav"
    if custom_score.is_file():
        return custom_score
    total_duration = sum(s.duration_s for s in contract.shots) + 5
    out = ctx.audio_dir / "score_fallback.wav"
    digest = compute_hash({"duration": total_duration, "style": contract.music_style})
    if not is_cached(out, digest):
        generate_ambient_score(duration_s=total_duration, out_path=out)
        write_cache_hash(out, digest)
    return out
