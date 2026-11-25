from pathlib import Path
from pipeline.context import PipelineContext, compute_hash, is_cached, write_cache_hash
from pipeline.providers.gemini import generate_script


def run_script_stage(
    ctx: PipelineContext,
    topic: str,
    source_text: str,
    language_code: str = "am",
) -> Path:
    digest = compute_hash({"topic": topic, "source": source_text, "lang": language_code})
    if is_cached(ctx.script_path, digest):
        return ctx.script_path
    script = generate_script(topic=topic, source_text=source_text, language_code=language_code)
    ctx.script_path.write_text(script, encoding="utf-8")
    write_cache_hash(ctx.script_path, digest)
    return ctx.script_path
