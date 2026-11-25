from pipeline.context import PipelineContext, compute_hash, is_cached, write_cache_hash
from pipeline.media.audio import build_srt, pcm_to_wav


def test_stage_cache_hit_and_invalidation(tmp_path):
    ctx = PipelineContext(project_id="test-proj", storage_dir=tmp_path)
    out = ctx.keyframes_dir / "shot_00.png"
    digest_a = compute_hash({"prompt": "shot 0", "seed": 42})
    out.write_bytes(b"png-bytes")
    write_cache_hash(out, digest_a)

    assert is_cached(out, digest_a) is True
    assert is_cached(out, compute_hash({"prompt": "edited shot 0", "seed": 42})) is False


def test_pcm_to_wav_adds_riff_header():
    wav = pcm_to_wav(b"\x00\x00" * 100, "audio/L16;rate=24000")
    assert wav[:4] == b"RIFF"


def test_build_srt_formats_subtitles(tmp_path):
    ctx = PipelineContext(project_id="srt-test", storage_dir=tmp_path)
    from pipeline.context import StoryboardShot

    shots = [
        StoryboardShot(
            index=0,
            description="Opening hill",
            image_prompt="Wide shot of Ethiopian hills at dawn",
            narration_text="ንጋት",
            narration_en="Dawn over the hills.",
            duration_s=6,
        )
    ]
    srt = build_srt(shots)
    assert "00:00:00,000 --> 00:00:06,000" in srt
    assert "Dawn over the hills." in srt
