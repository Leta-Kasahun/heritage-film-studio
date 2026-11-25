"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, listAllAssets } from "@/features/media/services/media-service";
import { VideoCard } from "@/features/media/components/VideoCard";
import { ROUTES } from "@/constants/routes";
import {
  IconPlay,
  IconFilm,
  IconImage,
  IconLoader,
  IconMic,
  IconPlus,
} from "@/components/ui/Icon";

type MediaFilter = "all" | "video" | "audio" | "image";

interface Props {
  title?: string;
  searchQuery?: string;
  pageSize?: number;
}

export function ProjectFeed({
  title = "Generated Media",
  searchQuery = "",
  pageSize = 9,
}: Props) {
  const qc = useQueryClient();
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const assetTypeParam = mediaFilter === "all" ? undefined : mediaFilter;

  const query = useInfiniteQuery({
    queryKey: ["all-assets", mediaFilter, pageSize],
    queryFn: ({ pageParam }) => listAllAssets(pageParam, pageSize, assetTypeParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length + 1,
  });

  const allItems = query.data?.pages.flat() ?? [];
  const visible = allItems.filter((a) => {
    if (a.asset_type === "subtitle") return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.object_key.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.asset_type.toLowerCase().includes(q)
    );
  });

  const loading = query.isLoading || query.isFetchingNextPage;
  const hasMore = !!query.hasNextPage;

  const handleRemove = useCallback(
    async (assetId: string) => {
      await deleteAsset(assetId);
      qc.invalidateQueries({ queryKey: ["all-assets"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    [qc]
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              width: 32,
              height: 3,
              background: "var(--crimson)",
              borderRadius: 2,
              display: "inline-block",
            }}
          />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 700 }}>
            {title}
          </h2>
        </div>

        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {(
            [
              ["all", IconFilm, "All"],
              ["video", IconPlay, "Videos"],
              ["audio", IconMic, "Audio"],
              ["image", IconImage, "Images"],
            ] as const
          ).map(([value, Icon, label]) => {
            const active = mediaFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMediaFilter(value)}
                className={active ? "btn btn-primary" : "btn btn-outline"}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {query.isLoading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="card" style={{ overflow: "hidden" }}>
              <div className="skeleton-box" style={{ width: "100%", aspectRatio: "16 / 9" }} />
              <div style={{ padding: "0.75rem 0.9rem" }}>
                <div className="skeleton-box" style={{ height: 12, width: "55%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {query.isError && (
        <div className="card" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-2)", fontSize: "0.875rem" }}>
          Unable to load generated media right now. Please ensure the backend server is running.
        </div>
      )}

      {!query.isLoading && !query.isError && visible.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: "var(--crimson-pale)",
            color: "var(--crimson)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "0.9rem",
          }}>
            <IconFilm size={20} />
          </div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "0.35rem" }}>
            No {mediaFilter === "all" ? "media" : mediaFilter} generated yet
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            Create a heritage project to generate videos, audio narration, or keyframe images.
          </p>
          <Link href={ROUTES.newProject} className="btn btn-primary">
            <IconPlus size={15} />
            Create New Project
          </Link>
        </div>
      )}

      {!query.isLoading && !query.isError && visible.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {visible.map((asset) => (
            <VideoCard
              key={asset.id}
              asset={asset}
              onDelete={handleRemove}
            />
          ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {query.isFetchingNextPage && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1.25rem 0", color: "var(--crimson)" }}>
          <IconLoader size={18} />
        </div>
      )}
    </div>
  );
}
