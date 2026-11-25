import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    title: str = Field(..., max_length=200)
    heritage_topic: str | None = Field(None, max_length=300)
    description: str | None = None
    language_code: str = Field("am", max_length=10)
    script_text: str | None = None
    settings: dict = Field(default_factory=dict)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(None, max_length=200)
    heritage_topic: str | None = Field(None, max_length=300)
    description: str | None = None
    language_code: str | None = Field(None, max_length=10)
    script_text: str | None = None
    status: str | None = Field(None, max_length=30)
    settings: dict | None = None


class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: str
    created_at: datetime
    updated_at: datetime
