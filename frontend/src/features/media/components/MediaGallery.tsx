"use client";

import { useAssets } from "../hooks/useAssets";
import { VideoCard } from "./VideoCard";
import { AspectRatio } from "../types";
import { IconFilm, IconLoader } from "@/components/ui/Icon";

interface Props {
  projectId: string;
  defaultRatio?: AspectRatio;
}

export function MediaGallery({ projectId, defaultRatio = "16:9" }: Props) {
  const { items, loading, hasMore, sentinelRef, removeAsset } = useAssets(projectId);

  const media = items.filter(
    (a) => a.asset_type === "image" || a.asset_type === "video" || a.asset_type === "audio"
  );

  if (!loading && media.length === 0) {
    return (
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
        <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
          No media generated yet — run keyframes, narration, or video stages first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: "grid",
        gridTemplateColumns:
          defaultRatio === "9:16"
            ? "repeat(auto-fill, minmax(210px, 1fr))"
            : "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.15rem",
        alignItems: "start",
      }}>
        {media.map((asset) => (
          <VideoCard
            key={asset.id}
            asset={asset}
            defaultRatio={defaultRatio}
            onDelete={removeAsset}
          />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "1.75rem",
          color: "var(--crimson)",
          fontSize: "0.85rem",
        }}>
          <IconLoader size={16} />
          <span>Loading media…</span>
        </div>
      )}

      {!hasMore && media.length > 0 && (
        <p style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-3)", fontSize: "0.78rem" }}>
          All media loaded
        </p>
      )}
    </div>
  );
}
