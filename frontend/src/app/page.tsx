"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useStats } from "@/features/projects/hooks/useProjects";
import { ProjectFeed } from "@/features/projects/components/ProjectFeed";
import { formatBytes } from "@/utils/format";
import {
  IconArrowRight,
  IconClapperboard,
  IconFilm,
  IconLandmark,
  IconPlay,
} from "@/components/ui/Icon";

export default function HomePage() {
  const { data: stats } = useStats();

  const STATS = [
    { Icon: IconClapperboard, value: String(stats?.total_projects ?? 0), label: "Total Projects" },
    { Icon: IconPlay,         value: String(stats?.videos_generated ?? 0), label: "Videos Generated" },
    { Icon: IconFilm,         value: formatBytes(stats?.storage_bytes ?? 0), label: "Storage Used" },
    { Icon: IconLandmark,     value: "Our Heritage", label: "Our Pride" },
  ];

  return (
    <>
      <section
        style={{
          position: "relative",
          minHeight: 340,
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(120deg, var(--crimson-deep) 0%, #A50E2D 55%, #5C0818 100%)",
          overflow: "hidden",
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 360"
          preserveAspectRatio="xMaxYMax slice"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.16,
            pointerEvents: "none",
          }}
        >
          <path d="M0,360 L0,250 L180,210 L360,260 L540,180 L760,240 L960,130 L1200,200 L1200,360 Z" fill="#FFFFFF" />
          <path d="M480,360 L660,220 L840,275 L1020,165 L1200,235 L1200,360 Z" fill="#FFFFFF" opacity="0.55" />
        </svg>

        <div className="page-wrap" style={{ position: "relative", zIndex: 2, paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div style={{ maxWidth: 520 }}>
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.82)",
                marginBottom: "0.75rem",
              }}
            >
              — Discover &nbsp;·&nbsp; Preserve &nbsp;·&nbsp; Inspire —
            </p>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4.5vw, 3rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.12,
                marginBottom: "0.85rem",
              }}
            >
              Heritage Film Studio
            </h1>

            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.6,
                marginBottom: "1.6rem",
                maxWidth: 440,
              }}
            >
              Turn Ethiopia&apos;s rich heritage into cinematic stories that inspire generations.
            </p>

            <Link href={ROUTES.newProject} className="btn btn-white">
              Create New Project
              <IconArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--surface-warm)", borderBottom: "1px solid var(--border)" }}>
        <div
          className="page-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            paddingTop: "1.15rem",
            paddingBottom: "1.15rem",
          }}
        >
          {STATS.map(({ Icon, value, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "var(--crimson)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={17} />
              </span>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2 }}>
                  {value}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--white)", padding: "2.25rem 0 3.5rem" }}>
        <div className="page-wrap">
          <ProjectFeed title="All Projects" />
        </div>
      </section>
    </>
  );
}
