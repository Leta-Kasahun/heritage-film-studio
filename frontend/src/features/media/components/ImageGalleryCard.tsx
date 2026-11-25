"use client";

import { useState } from "react";
import { AssetResponse, AspectRatio } from "../types";
import { getAssetDownloadUrl, getAssetStreamUrl } from "../services/media-service";
import { ImageSlideModal } from "./ImageSlideModal";
import { IconDownload, IconImage, IconLayers } from "@/components/ui/Icon";

interface Props {
  images: AssetResponse[];
  title?: string;
  defaultRatio?: AspectRatio;
}

export function ImageGalleryCard({
  images,
  title = "Storyboard Gallery",
  defaultRatio = "16:9",
}: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!images.length) return null;
  const cover = images[0];

  return (
    <>
      <article className="film-card" style={{ animation: "fadeIn 0.3s ease both" }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${title}`}
          style={{
            display: "block",
            position: "relative",
            width: "100%",
            aspectRatio: defaultRatio === "9:16" ? "9 / 16" : "16 / 9",
            background: "var(--surface-2)",
            border: "none",
            padding: 0,
            overflow: "hidden",
            textAlign: "left",
          }}
        >
          {!loaded && (
            <div className="skeleton-box" style={{ position: "absolute", inset: 0 }} />
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAssetStreamUrl(cover.object_key)}
            alt={title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={loaded ? "film-thumb-img" : undefined}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(15,15,15,0.72)",
              color: "#fff",
            }}
          >
            <IconLayers size={11} />
            {images.length} {images.length === 1 ? "Frame" : "Frames"}
          </span>

          <span
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15,15,15,0.65) 0%, transparent 55%)",
              display: "flex",
              alignItems: "flex-end",
              padding: "0.75rem 0.9rem",
            }}
          >
            <span style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <IconImage size={13} />
              Open Slide Gallery
            </span>
          </span>
        </button>

        <div style={{
          padding: "0.65rem 0.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          borderTop: "1px solid var(--border-soft)",
        }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-2)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <a
              href={getAssetDownloadUrl(cover.id)}
              download
              title="Download cover frame"
              aria-label="Download cover frame"
              className="btn btn-outline"
              style={{ padding: "0.24rem 0.45rem", fontSize: "0.7rem" }}
            >
              <IconDownload size={13} />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-primary"
              style={{ padding: "0.24rem 0.6rem", fontSize: "0.72rem" }}
            >
              View ({images.length})
            </button>
          </div>
        </div>
      </article>

      {open && (
        <ImageSlideModal
          images={images}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
