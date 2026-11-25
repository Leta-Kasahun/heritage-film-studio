import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class AssetBase(BaseModel):
    asset_type: str = Field(..., max_length=20)
    role: str = Field(..., max_length=40)
    storage_provider: str = Field("r2", max_length=20)
    bucket: str = Field(..., max_length=100)
    object_key: str
    mime_type: str = Field(..., max_length=100)
    size_bytes: int = Field(default=0, ge=0)
    checksum_sha256: str | None = Field(None, max_length=64)
    width_px: int | None = None
    height_px: int | None = None
    duration_seconds: Decimal | None = None
    metadata_: dict = Field(default_factory=dict, validation_alias="metadata_", serialization_alias="metadata")


class AssetCreate(AssetBase):
    project_id: uuid.UUID
    shot_id: uuid.UUID | None = None
    generation_run_id: uuid.UUID | None = None


class AssetResponse(AssetBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    project_id: uuid.UUID
    shot_id: uuid.UUID | None
    generation_run_id: uuid.UUID | None
    created_at: datetime
