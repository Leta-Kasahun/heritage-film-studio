import { apiFetch } from "@/lib/api-client";
import { ShotResponse } from "../types";

export function listShots(projectId: string): Promise<ShotResponse[]> {
  return apiFetch(`/shots/project/${encodeURIComponent(projectId)}`);
}

export function getShot(shotId: string): Promise<ShotResponse> {
  return apiFetch(`/shots/${encodeURIComponent(shotId)}`);
}
