from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Heritage Film Studio"
    APP_VERSION: str = "0.1.0"
    APP_ENV: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres123"
    POSTGRES_DB: str = "heritage_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres123@localhost:5432/heritage_db"
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR.parent / "storage"
    RUNS_LOG: Path = BASE_DIR / "runs.jsonl"

    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    GEMINI_TTS_MODEL: str = "gemini-3.8-flash-tts"

    CLOUDFLARE_ACCOUNT_ID: str = ""
    CLOUDFLARE_API_TOKEN: str = ""
    CF_IMAGE_MODEL: str = "@cf/black-forest-labs/flux-1-schnell"
    CF_IMAGE_ALT_MODEL: str = "@cf/black-forest-labs/flux-2-klein-4b"

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    MAX_UPLOAD_MB: int = 20

    def init_storage(self) -> None:
        self.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        for category in ("uploads", "storyboards", "audio", "images", "video"):
            (self.STORAGE_DIR / category).mkdir(parents=True, exist_ok=True)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
