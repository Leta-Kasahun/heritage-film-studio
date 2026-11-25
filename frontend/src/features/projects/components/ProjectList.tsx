"use client";

import Link from "next/link";
import { useProjects, useDeleteProject } from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import { IconChevronRight, IconTrash, IconClock, IconFilm, IconPlus, IconAlertCircle } from "@/components/ui/Icon";

export function ProjectList() {
  const { data: projects, isLoading, error } = useProjects();
  const del = useDeleteProject();

  if (isLoading) {
    return <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading projects…</p>;
  }

  if (error) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "var(--error-bg)",
        color: "var(--error-text)",
        borderRadius: "var(--radius-md)",
        padding: "0.9rem 1.1rem",
        fontSize: "0.85rem",
      }}>
        <IconAlertCircle size={16} />
        <span>Failed to load projects.</span>
      </div>
    );
  }

  if (!projects?.length) {
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
          marginBottom: "1rem",
        }}>
          <IconFilm size={20} />
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", marginBottom: "0.4rem" }}>
          No heritage films yet
        </h2>
        <p style={{ color: "var(--text-3)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Start by creating a project and uploading your story document.
        </p>
        <Link href={ROUTES.newProject} className="btn btn-primary">
          <IconPlus size={15} />
          Create your first film
        </Link>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {projects.map((p) => (
        <li
          key={p.id}
          className="card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.85rem",
            transition: "border-color var(--transition), box-shadow var(--transition)",
          }}
        >
          <div style={{ minWidth: 0, flex: "1 1 220px" }}>
            <Link
              href={ROUTES.project(p.id)}
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 600,
                fontSize: "1.05rem",
                color: "var(--text-1)",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {p.title}
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: 3, fontSize: "0.76rem", color: "var(--text-3)" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.heritage_topic}</span>
              <span>·</span>
              <IconClock size={11} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: "nowrap" }}>{formatDate(p.created_at)}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexShrink: 0 }}>
            <StatusBadge status={p.status} />
            <Link
              href={ROUTES.project(p.id)}
              className="btn btn-outline"
              style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
            >
              Open
              <IconChevronRight size={13} />
            </Link>
            <button
              onClick={() => {
                if (!confirm("Delete this project permanently?")) return;
                del.mutate(p.id);
              }}
              aria-label={`Delete ${p.title}`}
              className="btn btn-ghost"
              style={{ padding: "0.4rem" }}
            >
              <IconTrash size={15} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
