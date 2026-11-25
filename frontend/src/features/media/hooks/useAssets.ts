"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, listAssets } from "../services/media-service";

export function useAssets(projectId: string, pageSize = 12) {
  const qc = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["assets", projectId, pageSize],
    queryFn: ({ pageParam }) => listAssets(projectId, pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length + 1,
    enabled: !!projectId,
  });

  const items = query.data?.pages.flat() ?? [];
  const loading = query.isLoading || query.isFetchingNextPage;
  const hasMore = !!query.hasNextPage;

  const removeAsset = useCallback(
    async (assetId: string) => {
      await deleteAsset(assetId);
      qc.invalidateQueries({ queryKey: ["assets", projectId] });
      qc.invalidateQueries({ queryKey: ["all-assets"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    [projectId, qc]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          query.fetchNextPage();
        }
      },
      { rootMargin: "300px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, query]);

  return { items, loading, hasMore, sentinelRef, removeAsset };
}
