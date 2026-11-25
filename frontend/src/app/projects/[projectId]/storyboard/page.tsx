"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShotGrid } from "@/features/storyboard/components/ShotGrid";
import { ROUTES } from "@/constants/routes";
import { IconChevronRight } from "@/components/ui/Icon";

function StoryboardContent() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-3)", fontFamily: "var(--font-sans)", marginBottom: "0.75rem" }}>
            <Link href={ROUTES.projects} style={{ color: "var(--crimson)", fontWeight: 500 }}>Projects</Link>
            <IconChevronRight size={13} />
            <Link href={ROUTES.project(projectId)} style={{ color: "var(--crimson)", fontWeight: 500 }}>Project</Link>
            <IconChevronRight size={13} />
            <span style={{ color: "var(--text-2)", fontWeight: 500 }}>Storyboard</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>Storyboard</h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
            Each scene with its narration and visual notes
          </p>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", padding: "2rem 0", minHeight: "60vh" }}>
        <div className="page-wrap">
          <ShotGrid projectId={projectId} />
        </div>
      </section>
    </>
  );
}

export default function StoryboardPage() {
  return (
    <Suspense fallback={<section style={{ background: "var(--surface-1)", minHeight: "60vh", padding: "3rem 0" }}><div className="page-wrap" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading storyboard…</div></section>}>
      <StoryboardContent />
    </Suspense>
  );
}
