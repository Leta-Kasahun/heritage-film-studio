"use client";

import { useShots } from "../hooks/useShots";
import { IconFilm, IconClock, IconLayers } from "@/components/ui/Icon";

interface Props { projectId: string }

export function ShotGrid({ projectId }: Props) {
  const { data: shots, isLoading } = useShots(projectId);

  if (isLoading) {
    return <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Loading shots…</p>;
  }

  if (!shots?.length) {
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
          marginBottom: "0.9rem",
        }}>
          <IconLayers size={20} />
        </div>
        <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>
          No shots yet — run the storyboard stage from the project page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: "0.82rem", color: "var(--text-3)", marginBottom: "1rem" }}>
        {shots.length} {shots.length === 1 ? "shot" : "shots"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {shots.map((shot) => (
          <article key={shot.id} className="card" style={{ overflow: "hidden" }}>
            <div style={{
              width: "100%",
              aspectRatio: "16 / 9",
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--crimson)",
            }}>
              <IconFilm size={26} />
            </div>

            <div style={{ padding: "1rem 1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--crimson)",
                }}>
                  Shot {shot.shot_number}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "var(--text-3)" }}>
                  <IconClock size={11} />
                  {shot.duration_seconds}s
                </span>
              </div>

              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "0.98rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {shot.title}
              </h3>

              {shot.narration_text && (
                <blockquote style={{
                  borderLeft: "2.5px solid var(--crimson)",
                  paddingLeft: "0.65rem",
                  fontStyle: "italic",
                  fontSize: "0.82rem",
                  color: "var(--text-2)",
                  margin: "0.5rem 0",
                }}>
                  {shot.narration_text}
                </blockquote>
              )}

              {shot.subtitle_text && (
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: "0.35rem" }}>
                  {shot.subtitle_text}
                </p>
              )}

              <p style={{ fontSize: "0.73rem", color: "var(--text-3)", marginTop: "0.65rem", lineHeight: 1.5 }}>
                {shot.visual_prompt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
