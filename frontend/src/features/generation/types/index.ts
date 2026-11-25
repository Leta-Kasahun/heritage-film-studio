export type RunStatus = "running" | "succeeded" | "failed";

export interface GenerationRunResponse {
  id: string;
  project_id: string;
  shot_id: string | null;
  stage: string;
  provider: string;
  model: string;
  status: RunStatus;
  started_at: string;
  finished_at: string | null;
  latency_ms: number | null;
  input_data: Record<string, unknown>;
  output_data: Record<string, unknown> | null;
  error_message: string | null;
}
