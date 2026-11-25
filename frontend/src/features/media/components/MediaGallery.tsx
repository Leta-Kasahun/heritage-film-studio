"use client";

import { useAssets } from "../hooks/useAssets";
import { VideoCard } from "./VideoCard";
import { ImageGalleryCard } from "./ImageGalleryCard";
import { AspectRatio } from "../types";
import { IconFilm, IconLoader } from "@/components/ui/Icon";

interface Props {
  projectId: string;
  defaultRatio?: AspectRatio;
}

export function MediaGallery({ projectId, defaultRatio = "16:9" }: Props) {
  const { items, loading, hasMore, sentinelRef, removeAsset } = useAssets(projectId, 50);

  const videos = items.filter((a) => a.asset_type === "video");
  const audios = items.filter((a) => a.asset_type === "audio");
  const images = items.filter((a) => a.asset_type === "image");
  const totalCount = videos.length + audios.length + images.length;

  if (loading && totalCount === 0) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns:
          defaultRatio === "9:16"
            ? "repeat(auto-fill, minmax(210px, 1fr))"
            : "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.15rem",
      }}>
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="card" style={{ overflow: "hidden" }}>
            <div className="skeleton-box" style={{ width: "100%", aspectRatio: defaultRatio === "9:16" ? "9 / 16" : "16 / 9" }} />
            <div style={{ padding: "0.75rem 0.9rem" }}>
              <div className="skeleton-box" style={{ height: 12, width: "55%", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && totalCount === 0) {
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
          No media generated yet.
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
        {videos.map((asset) => (
          <VideoCard
            key={asset.id}
            asset={asset}
            defaultRatio={defaultRatio}
            onDelete={removeAsset}
          />
        ))}

        {images.length > 0 && (
          <ImageGalleryCard
            images={images}
            title="Narration Frames Gallery"
            defaultRatio={defaultRatio}
          />
        )}

        {audios.map((asset) => (
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

      {!hasMore && totalCount > 0 && (
        <p style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-3)", fontSize: "0.78rem" }}>
          All media loaded
        </p>
      )}
    </div>
  );
}
