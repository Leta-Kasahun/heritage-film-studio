import uuid
from sqlalchemy.orm import Session
from app.db.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: ProjectCreate) -> Project:
        record = Project(
            title=payload.title,
            heritage_topic=payload.heritage_topic,
            description=payload.description,
            language_code=payload.language_code,
            script_text=payload.script_text,
            settings=payload.settings,
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    def get_by_id(self, project_id: uuid.UUID) -> Project | None:
        return self.db.get(Project, project_id)

    def list(self, skip: int = 0, limit: int = 50) -> list[Project]:
        return (
            self.db.query(Project)
            .order_by(Project.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, project: Project, payload: ProjectUpdate) -> Project:
        data = payload.model_dump(exclude_unset=True)
        for key, value in data.items():
            setattr(project, key, value)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update_status(self, project: Project, status: str) -> None:
        project.status = status
        self.db.commit()

    def delete(self, project: Project) -> None:
        self.db.delete(project)
        self.db.commit()
