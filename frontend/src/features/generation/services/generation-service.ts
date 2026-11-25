import { apiFetch } from "@/lib/api-client";
import { GenerationRunResponse } from "../types";

export function triggerPipeline(
  projectId: string,
  stage: string
): Promise<GenerationRunResponse> {
  return apiFetch("/generation-runs/", {
    method: "POST",
    body: JSON.stringify({ project_id: projectId, stage }),
  });
}

export function listRuns(
  projectId: string
): Promise<GenerationRunResponse[]> {
  return apiFetch(`/generation-runs/project/${encodeURIComponent(projectId)}`);
}
