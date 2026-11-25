"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { deleteAsset, listAssets } from "../services/media-service";
import { AssetResponse } from "../types";

export function useAssets(projectId: string, pageSize = 12) {
  const [items, setItems] = useState<AssetResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const batch = await listAssets(projectId, page, pageSize);
      setItems((prev) => [...prev, ...batch]);
      if (batch.length < pageSize) setHasMore(false);
      else setPage((p) => p + 1);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, projectId, pageSize]);

  const removeAsset = useCallback(async (assetId: string) => {
    await deleteAsset(assetId);
    setItems((prev) => prev.filter((item) => item.id !== assetId));
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "300px", threshold: 0 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [projectId]);

  return { items, loading, hasMore, sentinelRef, removeAsset };
}
