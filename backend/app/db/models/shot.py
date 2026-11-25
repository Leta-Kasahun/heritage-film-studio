import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Shot(Base):
    __tablename__ = "shots"
    __table_args__ = (
        UniqueConstraint("project_id", "shot_number", name="uq_project_shot_number"),
        CheckConstraint("duration_seconds > 0", name="chk_shot_duration_positive"),
        Index("ix_shots_project_id", "project_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False
    )
    shot_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str | None] = mapped_column(String(200))
    duration_seconds: Mapped[Decimal] = mapped_column(Numeric(6, 2), default=Decimal("5.00"), nullable=False)
    narration_text: Mapped[str | None] = mapped_column(Text)
    subtitle_text: Mapped[str | None] = mapped_column(Text)
    visual_prompt: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False
    )

    project: Mapped["Project"] = relationship("Project", back_populates="shots")
    assets: Mapped[list["Asset"]] = relationship("Asset", back_populates="shot")
    generation_runs: Mapped[list["GenerationRun"]] = relationship("GenerationRun", back_populates="shot")
