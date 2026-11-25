import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from pydantic import BaseModel, Field
from app.core.config import get_settings


class StoryboardShot(BaseModel):
    index: int = Field(..., ge=0)
    description: str
    image_prompt: str = Field(..., min_length=20)
    motion_prompt: str = "slow gentle push in, soft natural light"
    narration_text: str
    narration_en: str = ""
    duration_s: int = Field(default=6, ge=3, le=15)
    music_cue: str = "warm underscore"
    reason: str = ""


class StoryboardContract(BaseModel):
    logline: str = Field(..., min_length=10)
    audience: str
    intent: str
    language: str = "am"
    music_style: str = "warm Ethiopian acoustic krar and gentle ambient strings"
    style_block: str = "cinematic documentary, golden hour, 35mm film grain, warm earth tones"
    end_card_text: str = "Made with AI · Heritage Film Studio"
    shots: list[StoryboardShot] = Field(..., min_length=6, max_length=14)


def compute_hash(payload: Any) -> str:
    raw = json.dumps(payload, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def is_cached(output_path: Path, digest: str) -> bool:
    hash_file = output_path.with_suffix(output_path.suffix + ".sha256")
    return (
        output_path.is_file()
        and hash_file.is_file()
        and hash_file.read_text(encoding="utf-8").strip() == digest
    )


def write_cache_hash(output_path: Path, digest: str) -> None:
    hash_file = output_path.with_suffix(output_path.suffix + ".sha256")
    hash_file.write_text(digest, encoding="utf-8")


@dataclass
class PipelineContext:
    project_id: str
    storage_dir: Path = field(default_factory=lambda: get_settings().STORAGE_DIR)
    aspect_ratios: list[str] = field(default_factory=lambda: ["16:9", "9:16"])

    @property
    def storyboard_path(self) -> Path:
        return self._ensure_dir("storyboards") / f"{self.project_id}.json"

    @property
    def script_path(self) -> Path:
        return self._ensure_dir("storyboards") / f"{self.project_id}_script.txt"

    @property
    def keyframes_dir(self) -> Path:
        return self._ensure_dir("images", self.project_id)

    @property
    def audio_dir(self) -> Path:
        return self._ensure_dir("audio", self.project_id)

    @property
    def video_dir(self) -> Path:
        return self._ensure_dir("video", self.project_id)

    def _ensure_dir(self, *parts: str) -> Path:
        path = self.storage_dir.joinpath(*parts)
        path.mkdir(parents=True, exist_ok=True)
        return path

    def load_storyboard(self, path: Path | None = None) -> StoryboardContract:
        target = path or self.storyboard_path
        data = json.loads(target.read_text(encoding="utf-8"))
        return StoryboardContract.model_validate(data)

    def save_storyboard(self, contract: StoryboardContract, path: Path | None = None) -> Path:
        target = path or self.storyboard_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(
            contract.model_dump_json(indent=2),
            encoding="utf-8",
        )
        return target
