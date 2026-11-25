import { useQuery } from "@tanstack/react-query";
import { listShots } from "../services/storyboard-service";

export function useShots(projectId: string) {
  return useQuery({
    queryKey: ["shots", projectId],
    queryFn: () => listShots(projectId),
    enabled: !!projectId,
  });
}
