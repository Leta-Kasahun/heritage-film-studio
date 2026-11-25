"use client";

import { useState, useEffect } from "react";
import { AssetResponse } from "../types";
import { getAssetDownloadUrl, getAssetStreamUrl } from "../services/media-service";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconX,
} from "@/components/ui/Icon";

interface Props {
  images: AssetResponse[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

export function ImageSlideModal({
  images,
  initialIndex = 0,
  title = "Narration Gallery",
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  if (!images.length) return null;
  const current = images[index] ?? images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(12, 6, 8, 0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 980,
          width: "100%",
          margin: "auto",
          background: "var(--white)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1.1rem",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 700 }}>
              {title}
            </h3>
            <p style={{ fontSize: "0.74rem", color: "var(--text-3)" }}>
              Frame {index + 1} of {images.length}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <a
              href={getAssetDownloadUrl(current.id)}
              download
              className="btn btn-outline"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}
            >
              <IconDownload size={13} />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="btn btn-ghost"
              style={{ padding: "0.35rem" }}
            >
              <IconX size={17} />
            </button>
          </div>
        </div>

        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#120609",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.id}
            src={getAssetStreamUrl(current.object_key)}
            alt={`Frame ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              animation: "fadeIn 0.25s ease",
            }}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous frame"
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                style={{
                  position: "absolute",
                  left: 12,
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "rgba(15,15,15,0.65)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconChevronLeft size={18} />
              </button>

              <button
                type="button"
                aria-label="Next frame"
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                style={{
                  position: "absolute",
                  right: 12,
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.35)",
                  background: "rgba(15,15,15,0.65)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        <div style={{
          display: "flex",
          gap: "0.45rem",
          padding: "0.75rem 1rem",
          overflowX: "auto",
          background: "var(--surface-1)",
          borderTop: "1px solid var(--border-soft)",
        }}>
          {images.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setIndex(i)}
                style={{
                  width: 72,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  border: active ? "2px solid var(--crimson)" : "1px solid var(--border)",
                  opacity: active ? 1 : 0.6,
                  padding: 0,
                  background: "#000",
                  transition: "all var(--transition)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetStreamUrl(img.object_key)}
                  alt={`Thumbnail ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
