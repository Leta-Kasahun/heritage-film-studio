import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProjects, getProject, createProject, deleteProject, getStats } from "../services/project-service";
import { ProjectCreate } from "../types";

export function useStats() {
  return useQuery({ queryKey: ["stats"], queryFn: getStats });
}

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: listProjects });
}

export function useProject(id: string) {
  return useQuery({ queryKey: ["project", id], queryFn: () => getProject(id), enabled: !!id });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectCreate) => createProject(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
