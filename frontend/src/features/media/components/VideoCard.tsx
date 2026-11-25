"use client";

import { useState, useEffect, useRef } from "react";
import { AssetResponse, AspectRatio, inferAssetRatio } from "../types";
import { getAssetDownloadUrl, getAssetStreamUrl } from "../services/media-service";
import {
  IconDownload,
  IconMic,
  IconMonitor,
  IconMusic,
  IconSmartphone,
  IconTrash,
} from "@/components/ui/Icon";

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
  const isAudio = asset.asset_type === "audio";
  const assetRatio = inferAssetRatio(asset);
  const isVerticalInHorizontal = assetRatio === "9:16" && ratio === "16:9";
  const mediaUrl = getAssetStreamUrl(asset.object_key);
  const AudioIcon = asset.role === "score" ? IconMusic : IconMic;

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
        background: isAudio
          ? "linear-gradient(135deg, var(--crimson-deep) 0%, #3A0712 100%)"
          : isVerticalInHorizontal
            ? "#1B060B"
            : "var(--surface-2)",
        overflow: "hidden",
      }}>
        {!loaded && !isAudio && (
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
            className={loaded ? "film-thumb-img" : undefined}
            style={{
              width: "100%",
              height: "100%",
              objectFit: isVerticalInHorizontal ? "contain" : "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        )}

        {isAudio && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "1rem",
            color: "#fff",
          }}>
            <span style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <AudioIcon size={20} />
            </span>
            <span style={{ fontSize: "0.75rem", opacity: 0.85, textTransform: "capitalize" }}>
              {asset.role.replace("_", " ")}
            </span>
            {visible && (
              <audio
                controls
                preload="none"
                src={mediaUrl}
                style={{ width: "100%", maxWidth: 260, height: 34 }}
              />
            )}
          </div>
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

          <a
            href={getAssetDownloadUrl(asset.id)}
            download
            title="Download"
            aria-label="Download asset"
            className="btn btn-outline"
            style={{ padding: "0.24rem 0.45rem", fontSize: "0.7rem" }}
          >
            <IconDownload size={13} />
          </a>

          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Remove"
              aria-label="Remove asset"
              className="btn btn-ghost"
              style={{ padding: "0.24rem 0.4rem" }}
            >
              <IconTrash size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
