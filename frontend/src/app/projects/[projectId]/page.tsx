"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PipelinePanel } from "@/features/generation/components/PipelinePanel";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/utils/format";
import { IconLayers, IconEye, IconChevronRight, IconClock } from "@/components/ui/Icon";

function ProjectDetailContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) {
    return (
      <section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}>
        <div className="page-wrap" style={{ color: "var(--text-3)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
          Loading project…
        </div>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}>
        <div className="page-wrap">
          <div style={{ background: "var(--error-bg)", color: "var(--error-text)", borderRadius: "var(--radius-md)", padding: "1rem 1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}>
            Project not found.
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-3)", fontFamily: "var(--font-sans)", marginBottom: "0.9rem" }}>
            <Link href={ROUTES.projects} style={{ color: "var(--crimson)", fontWeight: 500 }}>Projects</Link>
            <IconChevronRight size={13} />
            <span style={{ color: "var(--text-2)", fontWeight: 500 }}>{project.title}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "0.3rem" }}>
                {project.title}
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-2)" }}>{project.heritage_topic}</p>
              {project.description && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", color: "var(--text-3)", marginTop: "0.25rem" }}>
                  {project.description}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem" }}>
                <IconClock size={12} style={{ color: "var(--text-3)" }} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontFamily: "var(--font-sans)" }}>
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
              Preview Media
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", padding: "2rem 0", minHeight: "60vh" }}>
        <div className="page-wrap" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: "1.25rem" }}>
            <style>{`@media (min-width: 900px) { .detail-grid { grid-template-columns: 320px 1fr !important; } }`}</style>
            <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
              <div style={{ position: "sticky", top: 68, alignSelf: "start" }}>
                <PipelinePanel projectId={projectId} />
              </div>

              <div className="card" style={{ padding: "1.5rem" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1rem" }}>Project details</h2>
                <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem 1.25rem", fontFamily: "var(--font-sans)", fontSize: "0.85rem" }}>
                  <dt style={{ color: "var(--text-3)", fontWeight: 500 }}>Language</dt>
                  <dd style={{ color: "var(--text-1)", fontWeight: 500 }}>{project.language_code.toUpperCase()}</dd>
                  <dt style={{ color: "var(--text-3)", fontWeight: 500 }}>Status</dt>
                  <dd><StatusBadge status={project.status} /></dd>
                  <dt style={{ color: "var(--text-3)", fontWeight: 500 }}>Created</dt>
                  <dd style={{ color: "var(--text-2)" }}>{formatDate(project.created_at)}</dd>
                </dl>

                {project.script_text && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.95rem", marginBottom: "0.6rem", color: "var(--text-1)" }}>
                      Generated script
                    </h3>
                    <pre style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.78rem",
                      color: "var(--text-2)",
                      background: "var(--surface-2)",
                      borderRadius: "var(--radius-md)",
                      padding: "1rem",
                      whiteSpace: "pre-wrap",
                      maxHeight: 280,
                      overflowY: "auto",
                      border: "1px solid var(--border)",
                      lineHeight: 1.65,
                    }}>
                      {project.script_text}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
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
