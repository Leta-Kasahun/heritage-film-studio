"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ProjectListItem, ProjectStatus } from "@/features/projects/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import { AspectRatio } from "@/features/media/types";
import sampleFilms from "@/features/projects/data/sample-films.json";
import {
  IconPlay,
  IconCalendar,
  IconArrowRight,
  IconFilm,
  IconMonitor,
  IconSmartphone,
} from "@/components/ui/Icon";

type FeedItem = ProjectListItem & {
  aspect_ratio?: AspectRatio;
  thumbnail_url?: string;
};

type RatioFilter = "all" | AspectRatio;

interface Props {
  title?: string;
  searchQuery?: string;
  pageSize?: number;
}

function LazyThumb({
  src,
  alt,
  itemRatio,
  frameRatio,
}: {
  src?: string;
  alt: string;
  itemRatio: AspectRatio;
  frameRatio: AspectRatio;
}) {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isVerticalInHorizontalFrame = itemRatio === "9:16" && frameRatio === "16:9";

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "160px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (inView && imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [inView]);

  return (
    <div
      ref={boxRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: frameRatio === "9:16" ? "9 / 16" : "16 / 9",
        background: isVerticalInHorizontalFrame ? "#1B060B" : "var(--surface-2)",
        overflow: "hidden",
      }}
    >
      {!loaded && (
        <div
          className="skeleton-box"
          style={{ position: "absolute", inset: 0 }}
        />
      )}

      {inView && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={loaded ? "film-thumb-img" : undefined}
          style={{
            width: "100%",
            height: "100%",
            objectFit: isVerticalInHorizontalFrame ? "contain" : "cover",
            opacity: loaded ? 1 : 0,
            transform: loaded ? undefined : "scale(1.02)",
            transition: "opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      )}

      <span
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.03em",
          padding: "0.15rem 0.45rem",
          borderRadius: "var(--radius-sm)",
          background: "rgba(15,15,15,0.68)",
          color: "#fff",
        }}
      >
        {itemRatio}
      </span>

      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.14)",
        }}
      >
        <span
          className="film-play-btn"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(4px)",
            border: "1.5px solid rgba(255,255,255,0.82)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconPlay size={17} style={{ marginLeft: 2 }} />
        </span>
      </span>
    </div>
  );
}

function SkeletonCard({ frameRatio }: { frameRatio: AspectRatio }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        className="skeleton-box"
        style={{
          width: "100%",
          aspectRatio: frameRatio === "9:16" ? "9 / 16" : "16 / 9",
        }}
      />
      <div style={{ padding: "0.95rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="skeleton-box" style={{ height: 16, width: "70%", borderRadius: 4 }} />
        <div className="skeleton-box" style={{ height: 12, width: "90%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function ProjectFeed({
  title = "All Projects",
  searchQuery = "",
  pageSize = 6,
}: Props) {
  const { data: projects } = useProjects();
  const [ratioFilter, setRatioFilter] = useState<RatioFilter>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const source: FeedItem[] =
    projects && projects.length > 0
      ? projects
      : (sampleFilms as (Omit<FeedItem, "status"> & { status: ProjectStatus })[]);

  const filtered = source.filter((p) => {
    const itemRatio = p.aspect_ratio ?? "16:9";
    if (ratioFilter !== "all" && itemRatio !== ratioFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.heritage_topic.toLowerCase().includes(q)
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;
  const frameRatio: AspectRatio = ratioFilter === "9:16" ? "9:16" : "16:9";

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [searchQuery, ratioFilter, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loadingMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => c + pageSize);
            setLoadingMore(false);
          }, 260);
        }
      },
      { rootMargin: "280px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, pageSize]);

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
              ["16:9", IconMonitor, "Horizontal"],
              ["9:16", IconSmartphone, "Vertical"],
            ] as const
          ).map(([value, Icon, label]) => {
            const active = ratioFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRatioFilter(value)}
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

      {visible.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3.5rem 1.5rem" }}>
          <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
            No matching films found.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              frameRatio === "9:16"
                ? "repeat(auto-fill, minmax(210px, 1fr))"
                : "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {visible.map((p) => {
            const itemRatio = p.aspect_ratio ?? "16:9";
            const isSample = p.id.startsWith("sample-");
            const href = isSample ? ROUTES.newProject : ROUTES.project(p.id);

            return (
              <article
                key={p.id}
                className="film-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  animation: "fadeIn 0.3s ease both",
                }}
              >
                <Link href={isSample ? ROUTES.newProject : ROUTES.preview(p.id)}>
                  <LazyThumb
                    src={p.thumbnail_url}
                    alt={p.title}
                    itemRatio={itemRatio}
                    frameRatio={frameRatio}
                  />
                </Link>

                <div style={{ padding: "0.95rem 1.1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <Link
                    href={href}
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontWeight: 700,
                      fontSize: "1.02rem",
                      color: "var(--text-1)",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {p.title}
                  </Link>

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-2)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "0.85rem",
                    }}
                  >
                    {p.heritage_topic}
                  </p>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      paddingTop: "0.65rem",
                      borderTop: "1px solid var(--border-soft)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.73rem", color: "var(--text-3)" }}>
                        <IconCalendar size={12} />
                        {formatDate(p.created_at)}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>

                    <Link
                      href={href}
                      aria-label={`Open ${p.title}`}
                      className="film-arrow-btn"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "1px solid var(--crimson)",
                        color: "var(--crimson)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <IconArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {loadingMore &&
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={`sk-${idx}`} frameRatio={frameRatio} />
            ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
