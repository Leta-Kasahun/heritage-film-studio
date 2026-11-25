import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class ShotBase(BaseModel):
    shot_number: int = Field(..., ge=1)
    title: str | None = Field(None, max_length=200)
    duration_seconds: Decimal = Field(default=Decimal("5.00"), gt=0)
    narration_text: str | None = None
    subtitle_text: str | None = None
    visual_prompt: str | None = None
    metadata_: dict = Field(default_factory=dict, validation_alias="metadata_", serialization_alias="metadata")


class ShotCreate(ShotBase):
    project_id: uuid.UUID


class ShotUpdate(BaseModel):
    shot_number: int | None = Field(None, ge=1)
    title: str | None = Field(None, max_length=200)
    duration_seconds: Decimal | None = Field(None, gt=0)
    narration_text: str | None = None
    subtitle_text: str | None = None
    visual_prompt: str | None = None
    status: str | None = Field(None, max_length=30)
    metadata_: dict | None = Field(None, alias="metadata")


class ShotResponse(ShotBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    project_id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime
