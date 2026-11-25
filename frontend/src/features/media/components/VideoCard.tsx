"use client";

import { useState, useEffect, useRef } from "react";
import { AssetResponse, AspectRatio, inferAssetRatio } from "../types";
import { getAssetDownloadUrl, getAssetStreamUrl } from "../services/media-service";
import { IconDownload, IconMonitor, IconSmartphone, IconTrash } from "@/components/ui/Icon";

interface Props {
  asset: AssetResponse;
  defaultRatio?: AspectRatio;
  onDelete?: (assetId: string) => Promise<void>;
}

export function VideoCard({ asset, defaultRatio = "16:9", onDelete }: Props) {
  const [ratio, setRatio] = useState<AspectRatio>(defaultRatio);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRatio(defaultRatio);
  }, [defaultRatio]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isVideo = asset.asset_type === "video";
  const isImage = asset.asset_type === "image";
  const assetRatio = inferAssetRatio(asset);
  const isVerticalInHorizontal = assetRatio === "9:16" && ratio === "16:9";
  const mediaUrl = getAssetStreamUrl(asset.object_key);

  async function handleDelete() {
    if (!onDelete || deleting) return;
    if (!confirm("Remove this generated file?")) return;
    setDeleting(true);
    try {
      await onDelete(asset.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article ref={containerRef} className="film-card" style={{ animation: "fadeIn 0.3s ease both" }}>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio === "9:16" ? "9 / 16" : "16 / 9",
        background: isVerticalInHorizontal ? "#1B060B" : "var(--surface-2)",
        overflow: "hidden",
      }}>
        {!loaded && (
          <div className="skeleton-box" style={{ position: "absolute", inset: 0 }} />
        )}
        {isVideo && visible && (
          <video
            src={mediaUrl}
            controls
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: isVerticalInHorizontal ? "contain" : "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />
        )}
        {isImage && visible && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt="Generated keyframe"
            decoding="async"
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: isVerticalInHorizontal ? "contain" : "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          />
        )}
      </div>

      <div style={{
        padding: "0.65rem 0.9rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.5rem",
        borderTop: "1px solid var(--border-soft)",
      }}>
        <span style={{ fontSize: "0.74rem", color: "var(--text-3)", textTransform: "capitalize" }}>
          {asset.asset_type} · {ratio}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          {(isVideo || isImage) && (
            <>
              {([["16:9", IconMonitor], ["9:16", IconSmartphone]] as const).map(([r, Icon]) => {
                const active = ratio === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatio(r)}
                    aria-label={`Aspect ratio ${r}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.45rem",
                      border: `1px solid ${active ? "var(--crimson)" : "var(--border)"}`,
                      borderRadius: "var(--radius-sm)",
                      background: active ? "var(--crimson)" : "var(--white)",
                      color: active ? "#fff" : "var(--text-2)",
                      fontWeight: 600,
                      transition: "all var(--transition)",
                    }}
                  >
                    <Icon size={11} />
                    {r}
                  </button>
                );
              })}
            </>
          )}

          <a
            href={getAssetDownloadUrl(asset.id)}
            download
            aria-label="Download asset"
            className="btn btn-outline"
            style={{ padding: "0.22rem 0.45rem", fontSize: "0.7rem" }}
          >
            <IconDownload size={12} />
          </a>

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Remove asset"
              className="btn btn-ghost"
              style={{ padding: "0.22rem 0.4rem" }}
            >
              <IconTrash size={12} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
