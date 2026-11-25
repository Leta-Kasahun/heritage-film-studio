"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProjectFeed } from "@/features/projects/components/ProjectFeed";
import { ROUTES } from "@/constants/routes";
import { IconPlus } from "@/components/ui/Icon";

function ProjectsContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>
              Heritage Films
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "0.2rem" }}>
              {q ? `Results for "${q}"` : "Browse and manage your heritage films"}
            </p>
          </div>
          <Link href={ROUTES.newProject} className="btn btn-primary">
            <IconPlus size={15} />
            New Film
          </Link>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", minHeight: "65vh", padding: "2rem 0" }}>
        <div className="page-wrap">
          <ProjectFeed title={q ? `Results for "${q}"` : "All Projects"} searchQuery={q} />
        </div>
      </section>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<section style={{ background: "var(--surface-1)", minHeight: "65vh", padding: "3rem 0" }}><div className="page-wrap" style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading projects…</div></section>}>
      <ProjectsContent />
    </Suspense>
  );
}
