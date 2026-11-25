from pathlib import Path
from pipeline.context import (
    PipelineContext,
    StoryboardContract,
    compute_hash,
    is_cached,
    write_cache_hash,
)
from pipeline.media.ffmpeg import ken_burns_clip


def run_shots_stage(
    ctx: PipelineContext,
    contract: StoryboardContract,
    keyframes: list[Path],
    width: int = 1280,
    height: int = 720,
) -> list[Path]:
    outputs: list[Path] = []
    for shot, keyframe in zip(contract.shots, keyframes):
        wan_clip = ctx.video_dir / f"wan_shot_{shot.index:02d}.mp4"
        if wan_clip.is_file():
            outputs.append(wan_clip)
            continue
        out = ctx.video_dir / f"shot_{shot.index:02d}_{width}x{height}.mp4"
        digest = compute_hash({
            "keyframe": keyframe.name,
            "duration": shot.duration_s,
            "motion": shot.motion_prompt,
            "w": width,
            "h": height,
        })
        if not is_cached(out, digest):
            ken_burns_clip(
                image_path=keyframe,
                duration_s=shot.duration_s,
                out_path=out,
                width=width,
                height=height,
            )
            write_cache_hash(out, digest)
        outputs.append(out)
    return outputs
