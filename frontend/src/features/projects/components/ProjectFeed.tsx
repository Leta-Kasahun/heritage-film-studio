"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAsset, listAllAssets } from "@/features/media/services/media-service";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { AssetResponse } from "@/features/media/types";
import { VideoCard } from "@/features/media/components/VideoCard";
import { ImageGalleryCard } from "@/features/media/components/ImageGalleryCard";
import { Reveal } from "@/components/ui/Reveal";
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
  pageSize = 24,
}: Props) {
  const qc = useQueryClient();
  const { data: projects } = useProjects();
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const projectTitleMap = new Map((projects ?? []).map((p) => [p.id, p.title]));
  const assetTypeParam = mediaFilter === "all" ? undefined : mediaFilter;

  const query = useInfiniteQuery({
    queryKey: ["all-assets", mediaFilter, pageSize],
    queryFn: ({ pageParam }) => listAllAssets(pageParam, pageSize, assetTypeParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < pageSize ? undefined : allPages.length + 1,
  });

  const allItems = Array.from(
    new Map((query.data?.pages.flat() ?? []).map((a) => [a.id, a])).values()
  );

  const filtered = allItems.filter((a) => {
    if (a.asset_type === "subtitle") return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const projectName = (projectTitleMap.get(a.project_id) ?? "").toLowerCase();
    return (
      projectName.includes(q) ||
      a.object_key.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.asset_type.toLowerCase().includes(q)
    );
  });

  const videos = filtered.filter((a) => a.asset_type === "video");
  const audios = filtered.filter((a) => a.asset_type === "audio");
  const imagesByProject = new Map<string, AssetResponse[]>();
  for (const img of filtered.filter((a) => a.asset_type === "image")) {
    const group = imagesByProject.get(img.project_id) ?? [];
    group.push(img);
    imagesByProject.set(img.project_id, group);
  }

  const hasContent = videos.length > 0 || audios.length > 0 || imagesByProject.size > 0;
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
      <Reveal>
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
      </Reveal>

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

      {!query.isLoading && !query.isError && !hasContent && (
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
            No {mediaFilter === "all" ? "films" : mediaFilter} yet
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            Tell a family story to generate your first film, audio narration, or gallery.
          </p>
          <Link href={ROUTES.newProject} className="btn btn-primary">
            <IconPlus size={15} />
            Create a Film
          </Link>
        </div>
      )}

      {!query.isLoading && !query.isError && hasContent && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {videos.map((asset, idx) => (
            <Reveal key={asset.id} delayMs={Math.min(idx * 55, 275)}>
              <VideoCard
                asset={asset}
                onDelete={handleRemove}
              />
            </Reveal>
          ))}

          {Array.from(imagesByProject.entries()).map(([projectId, imgs], idx) => (
            <Reveal key={`gallery-${projectId}`} delayMs={Math.min((videos.length + idx) * 55, 275)}>
              <ImageGalleryCard
                images={imgs}
                title={projectTitleMap.get(projectId) ?? "Narration Gallery"}
              />
            </Reveal>
          ))}

          {audios.map((asset, idx) => (
            <Reveal key={asset.id} delayMs={Math.min((videos.length + imagesByProject.size + idx) * 55, 275)}>
              <VideoCard
                asset={asset}
                onDelete={handleRemove}
              />
            </Reveal>
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
