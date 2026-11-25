import uuid
from datetime import datetime, timezone
from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    heritage_topic: Mapped[str | None] = mapped_column(String(300))
    description: Mapped[str | None] = mapped_column(Text)
    language_code: Mapped[str] = mapped_column(String(10), default="am", nullable=False)
    script_text: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="draft", nullable=False)
    settings: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    shots: Mapped[list["Shot"]] = relationship(
        "Shot", back_populates="project", cascade="all, delete-orphan", order_by="Shot.shot_number"
    )
    assets: Mapped[list["Asset"]] = relationship(
        "Asset", back_populates="project", cascade="all, delete-orphan"
    )
    generation_runs: Mapped[list["GenerationRun"]] = relationship(
        "GenerationRun", back_populates="project", cascade="all, delete-orphan"
    )
