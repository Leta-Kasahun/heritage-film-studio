"use client";

import { ProjectStatus } from "@/features/projects/types";
import { IconAlertCircle, IconCheck, IconLoader } from "@/components/ui/Icon";

const PROGRESS_MAP: Record<ProjectStatus, { pct: number; message: string }> = {
  draft:                 { pct: 5,   message: "Preparing your story…" },
  uploaded:              { pct: 10,  message: "Story received, starting generation…" },
  generating_script:     { pct: 20,  message: "Writing narration script…" },
  generating_storyboard: { pct: 35,  message: "Planning visual scenes…" },
  generating_keyframes:  { pct: 55,  message: "Generating visual frames…" },
  generating_narration:  { pct: 75,  message: "Recording voice narration…" },
  generating_music:      { pct: 88,  message: "Composing background score…" },
  assembling:            { pct: 95,  message: "Finishing final video…" },
  done:                  { pct: 100, message: "Your heritage creation is ready." },
  error:                 { pct: 0,   message: "Generation stopped due to an error." },
};

interface Props {
  status: ProjectStatus;
  outputType?: string;
}

export function GenerationProgress({ status, outputType = "video" }: Props) {
  const info = PROGRESS_MAP[status] ?? { pct: 15, message: "Generating…" };
  const isDone = status === "done";
  const isError = status === "error";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div className="card" style={{ padding: "1.35rem", borderTop: "3px solid var(--crimson)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            {isDone ? (
              <IconCheck size={17} style={{ color: "var(--crimson)" }} />
            ) : isError ? (
              <IconAlertCircle size={17} style={{ color: "var(--error-text)" }} />
            ) : (
              <IconLoader size={17} style={{ color: "var(--crimson)" }} />
            )}
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", fontWeight: 600 }}>
              {info.message}
            </span>
          </div>

          <span style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: isError ? "var(--error-text)" : "var(--crimson)",
          }}>
            {info.pct}%
          </span>
        </div>

        <div style={{
          width: "100%",
          height: 8,
          background: "var(--surface-2)",
          borderRadius: 999,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${info.pct}%`,
            height: "100%",
            background: isError ? "var(--error-text)" : "var(--crimson)",
            borderRadius: 999,
            transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          }} />
        </div>
      </div>

      {!isDone && !isError && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.15rem",
        }}>
          {Array.from({ length: outputType === "audio" ? 2 : 3 }).map((_, i) => (
            <div key={i} className="card" style={{ overflow: "hidden" }}>
              <div className="skeleton-box" style={{ width: "100%", aspectRatio: "16 / 9" }} />
              <div style={{ padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <div className="skeleton-box" style={{ height: 14, width: "65%", borderRadius: 4 }} />
                <div className="skeleton-box" style={{ height: 10, width: "45%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
