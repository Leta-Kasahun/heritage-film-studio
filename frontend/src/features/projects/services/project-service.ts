import { apiFetch, uploadFile } from "@/lib/api-client";
import {
  ProjectCreate,
  ProjectListItem,
  ProjectResponse,
  ProjectUpdate,
  StudioStats,
} from "../types";

export function getStats(): Promise<StudioStats> {
  return apiFetch("/stats/");
}

export function listProjects(): Promise<ProjectListItem[]> {
  return apiFetch("/projects/");
}

export function getProject(id: string): Promise<ProjectResponse> {
  return apiFetch(`/projects/${id}`);
}

export function createProject(data: ProjectCreate): Promise<ProjectResponse> {
  return apiFetch("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProject(
  id: string,
  data: ProjectUpdate
): Promise<ProjectResponse> {
  return apiFetch(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: string): Promise<void> {
  return apiFetch(`/projects/${id}`, { method: "DELETE" });
}

export function uploadDocument(
  id: string,
  file: File
): Promise<ProjectResponse> {
  return uploadFile(`/projects/${id}/upload`, file);
}
