import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class GenerationRunBase(BaseModel):
    stage: str = Field(..., max_length=40)
    provider: str = Field(..., max_length=50)
    model: str = Field(..., max_length=100)
    status: str = Field("queued", max_length=20)
    prompt: str | None = None
    input_data: dict = Field(default_factory=dict)
    parameters: dict = Field(default_factory=dict)
    output_data: dict = Field(default_factory=dict)
    error_message: str | None = None
    cost_usd: Decimal | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None


class GenerationRunCreate(GenerationRunBase):
    project_id: uuid.UUID
    shot_id: uuid.UUID | None = None


class GenerationRunResponse(GenerationRunBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    project_id: uuid.UUID
    shot_id: uuid.UUID | None
    created_at: datetime
