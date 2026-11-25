"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MediaGallery } from "@/features/media/components/MediaGallery";
import { AspectRatio } from "@/features/media/types";
import { ROUTES } from "@/constants/routes";
import { IconChevronRight, IconMonitor, IconSmartphone } from "@/components/ui/Icon";

function PreviewContent() {
  const { projectId } = useParams<{ projectId: string }>();
  const [ratio, setRatio] = useState<AspectRatio>("16:9");

  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-3)", fontFamily: "var(--font-sans)", marginBottom: "0.75rem" }}>
            <Link href={ROUTES.projects} style={{ color: "var(--crimson)", fontWeight: 500 }}>Projects</Link>
            <IconChevronRight size={13} />
            <Link href={ROUTES.project(projectId)} style={{ color: "var(--crimson)", fontWeight: 500 }}>Project</Link>
            <IconChevronRight size={13} />
            <span style={{ color: "var(--text-2)", fontWeight: 500 }}>Preview</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>Generated Media</h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
                Images and video clips for your film
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              {([["16:9", IconMonitor, "Landscape"], ["9:16", IconSmartphone, "Vertical"]] as const).map(([r, Icon, label]) => (
                <button
                  key={r}
                  onClick={() => setRatio(r as AspectRatio)}
                  className={ratio === r ? "btn btn-primary" : "btn btn-outline"}
                  style={{ fontSize: "0.78rem", padding: "0.4rem 0.9rem" }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", padding: "2rem 0", minHeight: "60vh" }}>
        <div className="page-wrap">
          <MediaGallery projectId={projectId} defaultRatio={ratio} />
        </div>
      </section>
    </>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}><div className="page-wrap" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading preview…</div></section>}>
      <PreviewContent />
    </Suspense>
  );
}
