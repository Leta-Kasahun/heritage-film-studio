from pathlib import Path
from pipeline.context import (
    PipelineContext,
    StoryboardContract,
    compute_hash,
    is_cached,
    write_cache_hash,
)
from pipeline.providers.cloudflare import generate_image


def run_keyframes_stage(
    ctx: PipelineContext,
    contract: StoryboardContract,
    width: int = 1280,
    height: int = 720,
    seed: int = 42,
) -> list[Path]:
    outputs: list[Path] = []
    for shot in contract.shots:
        out = ctx.keyframes_dir / f"shot_{shot.index:02d}.png"
        full_prompt = f"{shot.image_prompt}. {contract.style_block}"
        digest = compute_hash({"prompt": full_prompt, "w": width, "h": height, "seed": seed + shot.index})
        if not is_cached(out, digest):
            img_bytes = generate_image(
                prompt=full_prompt,
                width=width,
                height=height,
                seed=seed + shot.index,
            )
            out.write_bytes(img_bytes)
            write_cache_hash(out, digest)
        outputs.append(out)
    return outputs
