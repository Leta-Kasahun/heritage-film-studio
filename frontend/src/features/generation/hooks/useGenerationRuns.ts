import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listRuns, triggerPipeline } from "../services/generation-service";

export function useRuns(projectId: string) {
  return useQuery({
    queryKey: ["runs", projectId],
    queryFn: () => listRuns(projectId),
    enabled: !!projectId,
    refetchInterval: 5000,
  });
}

export function useTriggerStage(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stage: string) => triggerPipeline(projectId, stage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["runs", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
}
