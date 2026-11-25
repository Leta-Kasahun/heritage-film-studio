import subprocess
from pathlib import Path


def _run_ffmpeg(args: list[str]) -> None:
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args]
    subprocess.run(cmd, check=True)


def ken_burns_clip(
    image_path: Path,
    duration_s: int,
    out_path: Path,
    width: int = 1280,
    height: int = 720,
    fps: int = 24,
) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    frames = duration_s * fps
    vf = (
        f"scale={width * 2}:{height * 2},"
        f"zoompan=z='min(zoom+0.0008,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        f":d={frames}:s={width}x{height}:fps={fps},format=yuv420p"
    )
    _run_ffmpeg(["-loop", "1", "-i", str(image_path), "-vf", vf, "-t", str(duration_s), "-c:v", "libx264", str(out_path)])
    return out_path


def generate_ambient_score(duration_s: int, out_path: Path) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    _run_ffmpeg([
        "-f", "lavfi",
        "-i", f"sine=frequency=220:duration={duration_s}",
        "-af", "volume=0.04,afade=t=in:st=0:d=2,afade=t=out:st=" + str(max(1, duration_s - 2)) + ":d=2",
        "-ar", "48000",
        "-ac", "2",
        str(out_path),
    ])
    return out_path


def render_end_card(
    text: str,
    out_path: Path,
    duration_s: int = 3,
    width: int = 1280,
    height: int = 720,
    fps: int = 24,
) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    safe_text = text.replace(":", "\\:").replace("'", "\\'")
    vf = (
        f"drawtext=text='{safe_text}':fontcolor=white:fontsize=32:"
        f"x=(w-text_w)/2:y=(h-text_h)/2,format=yuv420p"
    )
    _run_ffmpeg([
        "-f", "lavfi", "-i", f"color=c=#1B060B:s={width}x{height}:r={fps}:d={duration_s}",
        "-f", "lavfi", "-i", f"anullsrc=channel_layout=stereo:sample_rate=48000:d={duration_s}",
        "-vf", vf,
        "-c:v", "libx264", "-c:a", "aac", "-shortest",
        str(out_path),
    ])
    return out_path


def concat_media(paths: list[Path], out_path: Path, has_audio: bool = False) -> Path:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    list_file = out_path.with_suffix(".txt")
    list_file.write_text(
        "\n".join(f"file '{p.resolve().as_posix()}'" for p in paths),
        encoding="utf-8",
    )
    args = ["-f", "concat", "-safe", "0", "-i", str(list_file), "-c", "copy", str(out_path)]
    if has_audio:
        args = ["-f", "concat", "-safe", "0", "-i", str(list_file), "-c:v", "libx264", "-c:a", "aac", str(out_path)]
    _run_ffmpeg(args)
    list_file.unlink(missing_ok=True)
    return out_path


def assemble_film(
    clip_paths: list[Path],
    narration_paths: list[Path],
    music_path: Path,
    srt_path: Path,
    end_card_text: str,
    out_path: Path,
    width: int = 1280,
    height: int = 720,
) -> Path:
    work_dir = out_path.parent
    merged_video = work_dir / f"{out_path.stem}_raw.mp4"
    merged_voice = work_dir / f"{out_path.stem}_voice.wav"
    mixed_main = work_dir / f"{out_path.stem}_main.mp4"
    end_card = work_dir / f"{out_path.stem}_endcard.mp4"

    concat_media(clip_paths, merged_video)
    concat_media(narration_paths, merged_voice)

    srt_escaped = srt_path.resolve().as_posix().replace(":", "\\:")
    filter_complex = (
        "[2:a]aloop=loop=-1:size=2e+09[music];"
        "[music][1:a]sidechaincompress=threshold=0.02:ratio=6:attack=300:release=1500[ducked];"
        "[1:a][ducked]amix=inputs=2:duration=first,loudnorm=I=-14:TP=-1:LRA=11[aout];"
        f"[0:v]scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,"
        f"subtitles='{srt_escaped}':force_style='FontSize=20,MarginV=36'[vout]"
    )
    _run_ffmpeg([
        "-i", str(merged_video),
        "-i", str(merged_voice),
        "-i", str(music_path),
        "-filter_complex", filter_complex,
        "-map", "[vout]",
        "-map", "[aout]",
        "-c:v", "libx264",
        "-c:a", "aac",
        "-shortest",
        str(mixed_main),
    ])

    render_end_card(end_card_text, end_card, duration_s=3, width=width, height=height)
    concat_media([mixed_main, end_card], out_path, has_audio=True)

    for tmp in (merged_video, merged_voice, mixed_main, end_card):
        tmp.unlink(missing_ok=True)
    return out_path
