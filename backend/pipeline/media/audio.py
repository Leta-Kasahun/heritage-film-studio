import io
import subprocess
import wave
from pathlib import Path
from pipeline.context import StoryboardShot


def pcm_to_wav(audio_bytes: bytes, mime_type: str, sample_rate: int = 24000) -> bytes:
    if audio_bytes[:4] == b"RIFF" or "wav" in mime_type.lower():
        return audio_bytes
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(audio_bytes)
    return buf.getvalue()


def probe_duration(path: Path) -> float:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        str(path),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip() or 0.0)


def _fmt_srt_time(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    hrs, rem = divmod(ms, 3600000)
    mins, rem = divmod(rem, 60000)
    secs, millis = divmod(rem, 1000)
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"


def build_srt(shots: list[StoryboardShot]) -> str:
    lines: list[str] = []
    cursor = 0.0
    for idx, shot in enumerate(shots, start=1):
        text = (shot.narration_en or shot.narration_text).strip()
        start = _fmt_srt_time(cursor)
        end = _fmt_srt_time(cursor + shot.duration_s)
        lines.extend([str(idx), f"{start} --> {end}", text, ""])
        cursor += shot.duration_s
    return "\n".join(lines)
