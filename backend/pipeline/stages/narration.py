from pathlib import Path
from pipeline.context import (
    PipelineContext,
    StoryboardContract,
    compute_hash,
    is_cached,
    write_cache_hash,
)
from pipeline.media.audio import pcm_to_wav
from pipeline.providers.gemini_tts import generate_narration


def run_narration_stage(
    ctx: PipelineContext,
    contract: StoryboardContract,
    voice_style: str = "calm, warm, unhurried",
    voice_name: str = "Kore",
) -> list[Path]:
    outputs: list[Path] = []
    for shot in contract.shots:
        out = ctx.audio_dir / f"shot_{shot.index:02d}.wav"
        digest = compute_hash({
            "text": shot.narration_text,
            "lang": contract.language,
            "style": voice_style,
            "voice": voice_name,
        })
        if not is_cached(out, digest):
            raw_audio, mime = generate_narration(
                text=shot.narration_text,
                language_code=contract.language,
                voice_style=voice_style,
                voice_name=voice_name,
            )
            out.write_bytes(pcm_to_wav(raw_audio, mime))
            write_cache_hash(out, digest)
        outputs.append(out)
    return outputs
