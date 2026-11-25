from pathlib import Path
from pipeline.context import (
    PipelineContext,
    StoryboardContract,
    compute_hash,
    is_cached,
    write_cache_hash,
)
from pipeline.providers.gemini import generate_storyboard


def run_storyboard_stage(
    ctx: PipelineContext,
    script_text: str,
    language_code: str = "am",
    num_shots: int = 10,
) -> StoryboardContract:
    digest = compute_hash({"script": script_text, "lang": language_code, "shots": num_shots})
    if is_cached(ctx.storyboard_path, digest):
        return ctx.load_storyboard()
    raw = generate_storyboard(script_text=script_text, language_code=language_code, num_shots=num_shots)
    contract = StoryboardContract.model_validate(raw)
    ctx.save_storyboard(contract)
    write_cache_hash(ctx.storyboard_path, digest)
    return contract
