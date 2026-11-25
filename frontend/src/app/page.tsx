"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@/constants/routes";
import { useStats } from "@/features/projects/hooks/useProjects";
import { getAssetStreamUrl, listAllAssets } from "@/features/media/services/media-service";
import { ProjectFeed } from "@/features/projects/components/ProjectFeed";
import { Reveal } from "@/components/ui/Reveal";
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
  const { data: heroImages } = useQuery({
    queryKey: ["hero-backdrop"],
    queryFn: () => listAllAssets(1, 3, "image"),
  });

  const backdropUrl = heroImages?.[0]
    ? getAssetStreamUrl(heroImages[0].object_key)
    : null;

  const STATS = [
    { Icon: IconClapperboard, value: String(stats?.total_projects ?? 0), label: "Total Films" },
    { Icon: IconPlay,         value: String(stats?.videos_generated ?? 0), label: "Videos Ready" },
    { Icon: IconFilm,         value: formatBytes(stats?.storage_bytes ?? 0), label: "Media Stored" },
    { Icon: IconLandmark,     value: "Our Heritage", label: "Our Pride" },
  ];

  return (
    <>
      <section
        style={{
          position: "relative",
          minHeight: 430,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#180408",
          overflow: "hidden",
        }}
      >
        {backdropUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backdropUrl}
            alt="Heritage cinema showcase"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.55) contrast(1.08)",
              transform: "scale(1.03)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(140,13,36,0.48) 0%, rgba(24,4,8,0.88) 100%), linear-gradient(to top, rgba(24,4,8,0.96) 0%, transparent 45%, rgba(140,13,36,0.65) 100%)",
          }}
        />

        <div
          className="page-wrap"
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: 760,
            paddingTop: "4rem",
            paddingBottom: "4rem",
          }}
        >
          <Reveal delayMs={0}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.85)",
                marginBottom: "1rem",
              }}
            >
              AI-Powered Heritage Film Studio
            </p>
          </Reveal>

          <Reveal delayMs={90}>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.3rem, 5.5vw, 3.75rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.12,
                marginBottom: "1.1rem",
                textShadow: "0 4px 24px rgba(0,0,0,0.45)",
              }}
            >
              Every Heritage Has a Story.
              <br />
              <em style={{ fontStyle: "italic", color: "#FFD5DD" }}>Bring It to Life.</em>
            </h1>
          </Reveal>

          <Reveal delayMs={180}>
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.08rem)",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.65,
                margin: "0 auto 2rem",
                maxWidth: 620,
              }}
            >
              Transform historical stories, cultural traditions, and meaningful memories into cinematic films with AI-generated visuals, narration, original music, and subtitles.
            </p>
          </Reveal>

          <Reveal delayMs={260}>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link
                href={ROUTES.newProject}
                className="btn btn-primary"
                style={{ fontSize: "0.95rem", padding: "0.75rem 1.75rem", boxShadow: "0 6px 24px rgba(220,20,60,0.4)" }}
              >
                Create a Film
                <IconArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
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
          {STATS.map(({ Icon, value, label }, idx) => (
            <Reveal key={label} delayMs={idx * 70}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
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
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ background: "var(--white)", padding: "2.25rem 0 3.5rem" }}>
        <div className="page-wrap">
          <ProjectFeed title="All Films & Media" />
        </div>
      </section>
    </>
  );
}
