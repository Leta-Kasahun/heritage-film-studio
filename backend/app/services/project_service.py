import uuid
from pathlib import Path
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.exceptions import (
    FileSizeExceededException,
    InvalidFileFormatException,
    NotFoundException,
)
from app.db.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.project import ProjectUpdate

ALLOWED_EXTENSIONS = {".txt", ".pdf", ".docx"}


class ProjectService:
    def __init__(self, db: Session) -> None:
        self.repo = ProjectRepository(db)
        self.settings = get_settings()

    def get_project(self, project_id: uuid.UUID) -> Project:
        project = self.repo.get_by_id(project_id)
        if not project:
            raise NotFoundException("Project", project_id)
        return project

    async def upload_document(
        self, project_id: uuid.UUID, file: UploadFile
    ) -> Project:
        project = self.get_project(project_id)
        filename = Path(file.filename or "story.txt").name
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise InvalidFileFormatException(filename, sorted(ALLOWED_EXTENSIONS))

        content = await file.read()
        max_bytes = self.settings.MAX_UPLOAD_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise FileSizeExceededException(self.settings.MAX_UPLOAD_MB)

        upload_dir = self.settings.STORAGE_DIR / "uploads"
        upload_dir.mkdir(parents=True, exist_ok=True)
        dest = upload_dir / f"{project.id}_{filename}"
        dest.write_bytes(content)

        script_text = project.script_text
        if ext == ".txt":
            script_text = content.decode("utf-8", errors="replace")

        return self.repo.update(
            project,
            ProjectUpdate(
                script_text=script_text,
                status="uploaded",
                settings={**project.settings, "document_name": filename},
            ),
        )
