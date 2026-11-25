"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { GenerationProgress } from "@/features/generation/components/GenerationProgress";
import { MediaGallery } from "@/features/media/components/MediaGallery";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import { AspectRatio } from "@/features/media/types";
import { IconLayers, IconEye, IconChevronRight, IconClock } from "@/components/ui/Icon";

function ProjectDetailContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}>
        <div className="page-wrap" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
          Loading project…
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}>
        <div className="page-wrap">
          <div style={{ background: "var(--error-bg)", color: "var(--error-text)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", fontSize: "0.875rem" }}>
            Project not found.
          </div>
        </div>
      </section>
    );
  }

  const preferredRatio = (project.settings?.aspect_ratios?.[0] as AspectRatio) ?? "16:9";
  const outputType = project.settings?.output_type ?? "video";

  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-3)", marginBottom: "0.9rem" }}>
            <Link href={ROUTES.projects} style={{ color: "var(--crimson)", fontWeight: 500 }}>Projects</Link>
            <IconChevronRight size={13} />
            <span style={{ color: "var(--text-2)", fontWeight: 500 }}>{project.title}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "0.3rem" }}>
                {project.title}
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{project.heritage_topic}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
                <IconClock size={12} style={{ color: "var(--text-3)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  Created {formatDate(project.created_at)} · {project.language_code.toUpperCase()}
                </span>
              </div>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            <Link href={ROUTES.storyboard(projectId)} className="btn btn-outline" style={{ fontSize: "0.82rem", padding: "0.45rem 1rem" }}>
              <IconLayers size={14} />
              Storyboard
            </Link>
            <Link href={ROUTES.preview(projectId)} className="btn btn-primary" style={{ fontSize: "0.82rem", padding: "0.45rem 1rem" }}>
              <IconEye size={14} />
              Media Library
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", padding: "2rem 0", minHeight: "60vh" }}>
        <div className="page-wrap" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <GenerationProgress status={project.status} outputType={outputType} />

          {project.status === "done" && (
            <MediaGallery projectId={projectId} defaultRatio={preferredRatio} />
          )}

          {project.script_text && (
            <div className="card" style={{ padding: "1.35rem" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", marginBottom: "0.6rem" }}>
                Narration Script
              </h2>
              <p style={{ fontSize: "0.86rem", color: "var(--text-2)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                {project.script_text}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}><div className="page-wrap" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading project…</div></section>}>
      <ProjectDetailContent />
    </Suspense>
  );
}
