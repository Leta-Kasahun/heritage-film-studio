import uuid
from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.db.session import get_db
from app.repositories.generation_run_repository import GenerationRunRepository
from app.schemas.generation_run import GenerationRunResponse
from app.services.generation_run_service import GenerationRunService, execute_stage_task

router = APIRouter(prefix="/generation-runs", tags=["generation_runs"])


class StageTriggerRequest(BaseModel):
    project_id: uuid.UUID
    stage: str


@router.post("/", response_model=GenerationRunResponse, status_code=201)
def trigger_stage_run(
    payload: StageTriggerRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    run = GenerationRunService(db).create_stage_run(payload.project_id, payload.stage)
    background_tasks.add_task(execute_stage_task, run.id, payload.project_id, payload.stage)
    return run


@router.get("/project/{project_id}", response_model=list[GenerationRunResponse])
def list_runs_by_project(project_id: uuid.UUID, db: Session = Depends(get_db)):
    return GenerationRunRepository(db).list_by_project(project_id)


@router.get("/{run_id}", response_model=GenerationRunResponse)
def get_generation_run(run_id: uuid.UUID, db: Session = Depends(get_db)):
    run = GenerationRunRepository(db).get_by_id(run_id)
    if not run:
        raise NotFoundException("GenerationRun", run_id)
    return run
