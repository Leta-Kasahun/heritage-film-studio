export type ShotStatus = "pending" | "generating" | "done" | "error";

export interface ShotMetadata {
  camera?: { movement?: string; angle?: string };
  visual?: { lighting?: string; style?: string };
  motion?: { type?: string; direction?: string };
}

export interface ShotResponse {
  id: string;
  project_id: string;
  shot_number: number;
  title: string;
  duration_seconds: number;
  narration_text: string;
  subtitle_text: string | null;
  visual_prompt: string;
  status: ShotStatus;
  metadata: ShotMetadata;
  created_at: string;
  updated_at: string;
}

export interface ShotCreate {
  shot_number: number;
  title: string;
  duration_seconds: number;
  narration_text: string;
  subtitle_text?: string;
  visual_prompt: string;
  metadata?: ShotMetadata;
}
