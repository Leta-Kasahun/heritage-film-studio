import { ProjectStatus } from "@/features/projects/types";

type Variant = { label: string; color: string; bg: string; border: string };

const MAP: Record<ProjectStatus, Variant> = {
  draft:                 { label: "Draft",      color: "var(--text-2)",     bg: "var(--surface-2)",    border: "var(--border)" },
  uploaded:              { label: "Uploaded",   color: "var(--text-1)",     bg: "var(--surface-2)",    border: "var(--border)" },
  generating_script:     { label: "Scripting",  color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  generating_storyboard: { label: "Storyboard", color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  generating_keyframes:  { label: "Keyframes",  color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  generating_narration:  { label: "Narration",  color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  generating_music:      { label: "Music",      color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  assembling:            { label: "Assembling", color: "var(--crimson)",    bg: "var(--crimson-pale)", border: "rgba(220,20,60,0.22)" },
  done:                  { label: "Completed",  color: "#FFFFFF",           bg: "var(--crimson)",      border: "var(--crimson)" },
  error:                 { label: "Error",      color: "var(--error-text)", bg: "var(--error-bg)",     border: "#FECACA" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const v = MAP[status] ?? { label: status, color: "var(--text-2)", bg: "var(--surface-2)", border: "var(--border)" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.18rem 0.55rem",
      borderRadius: "var(--radius-sm)",
      fontSize: "0.72rem",
      fontWeight: 600,
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: "nowrap",
    }}>
      {v.label}
    </span>
  );
}
