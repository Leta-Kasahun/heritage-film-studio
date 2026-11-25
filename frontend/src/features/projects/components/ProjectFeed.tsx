"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useProjects, useDeleteProject } from "@/features/projects/hooks/useProjects";
import { ProjectListItem } from "@/features/projects/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import { AspectRatio } from "@/features/media/types";
import {
  IconPlay,
  IconCalendar,
  IconArrowRight,
  IconDownload,
  IconFilm,
  IconImage,
  IconLoader,
  IconMic,
  IconPlus,
  IconTrash,
} from "@/components/ui/Icon";

type MediaFilter = "all" | "video" | "audio" | "image";

interface Props {
  title?: string;
  searchQuery?: string;
  pageSize?: number;
}

function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="skeleton-box" style={{ width: "100%", aspectRatio: "16 / 9" }} />
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
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const filtered = (projects ?? []).filter((p: ProjectListItem) => {
    const itemType = p.settings?.output_type ?? "video";
    if (mediaFilter !== "all" && itemType !== mediaFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.heritage_topic.toLowerCase().includes(q)
    );
  });

  function handleRemove(p: ProjectListItem) {
    if (!confirm(`Remove "${p.title}"?`)) return;
    deleteProject.mutate(p.id);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [searchQuery, mediaFilter, pageSize]);

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

      {isLoading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      )}

      {error && (
        <div className="card" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-2)", fontSize: "0.875rem" }}>
          Unable to load projects right now. Please ensure the backend server is running.
        </div>
      )}

      {!isLoading && !error && visible.length === 0 && (
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
            {searchQuery ? "No matching projects" : "No projects yet"}
          </h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            {searchQuery
              ? `No projects matched "${searchQuery}".`
              : "Create your first heritage film, audio, or image collection."}
          </p>
          {!searchQuery && (
            <Link href={ROUTES.newProject} className="btn btn-primary">
              <IconPlus size={15} />
              Create New Project
            </Link>
          )}
        </div>
      )}

      {!isLoading && !error && visible.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {visible.map((p) => {
            const outputType = p.settings?.output_type ?? "video";
            const ratio = (p.settings?.aspect_ratios?.[0] as AspectRatio) ?? "16:9";
            const Icon = outputType === "audio" ? IconMic : outputType === "image" ? IconImage : IconPlay;

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
                <Link
                  href={ROUTES.preview(p.id)}
                  style={{
                    display: "block",
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    background: "linear-gradient(135deg, var(--crimson-deep) 0%, #3A0712 100%)",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      padding: "0.15rem 0.45rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(15,15,15,0.68)",
                      color: "#fff",
                      textTransform: "capitalize",
                    }}
                  >
                    {outputType} · {ratio}
                  </span>

                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="film-play-btn"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        border: "1.5px solid rgba(255,255,255,0.78)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={18} />
                    </span>
                  </span>
                </Link>

                <div style={{ padding: "0.95rem 1.1rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <Link
                    href={ROUTES.project(p.id)}
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

                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexShrink: 0 }}>
                      <Link
                        href={ROUTES.preview(p.id)}
                        title="Open & Download"
                        aria-label={`Download ${p.title}`}
                        className="btn btn-outline"
                        style={{ padding: "0.28rem 0.45rem" }}
                      >
                        <IconDownload size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(p)}
                        title="Remove"
                        aria-label={`Remove ${p.title}`}
                        className="btn btn-ghost"
                        style={{ padding: "0.28rem 0.4rem" }}
                      >
                        <IconTrash size={13} />
                      </button>

                      <Link
                        href={ROUTES.project(p.id)}
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
                </div>
              </article>
            );
          })}

          {loadingMore &&
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={`sk-${idx}`} />
            ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {loadingMore && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1.25rem 0", color: "var(--crimson)" }}>
          <IconLoader size={18} />
        </div>
      )}
    </div>
  );
}
