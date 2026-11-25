"use client";

import { useState } from "react";
import { useTriggerStage, useRuns } from "../hooks/useGenerationRuns";
import { GenerationRunResponse } from "../types";
import {
  IconFileText,
  IconLayers,
  IconImage,
  IconMic,
  IconMusic,
  IconFilm,
  IconLoader,
  IconCheck,
  IconAlertCircle,
} from "@/components/ui/Icon";

interface Props { projectId: string }

const STAGES = [
  { id: "script",     label: "Script",     Icon: IconFileText },
  { id: "storyboard", label: "Storyboard", Icon: IconLayers },
  { id: "keyframes",  label: "Keyframes",  Icon: IconImage },
  { id: "narration",  label: "Narration",  Icon: IconMic },
  { id: "music",      label: "Music",      Icon: IconMusic },
  { id: "assembly",   label: "Assembly",   Icon: IconFilm },
] as const;

export function PipelinePanel({ projectId }: Props) {
  const trigger = useTriggerStage(projectId);
  const { data: runs } = useRuns(projectId);
  const [active, setActive] = useState<string | null>(null);

  const latestByStage = runs?.reduce<Record<string, GenerationRunResponse>>((acc, r) => {
    if (!acc[r.stage] || r.started_at > acc[r.stage].started_at) acc[r.stage] = r;
    return acc;
  }, {});

  async function run(stageId: string) {
    setActive(stageId);
    try { await trigger.mutateAsync(stageId); } finally { setActive(null); }
  }

  return (
    <div className="card" style={{ padding: "1.35rem" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", marginBottom: "1rem" }}>
        Pipeline
      </h2>

      {trigger.isError && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--error-bg)",
          color: "var(--error-text)",
          borderRadius: "var(--radius-md)",
          padding: "0.65rem 0.9rem",
          fontSize: "0.8rem",
          marginBottom: "0.9rem",
        }}>
          <IconAlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{String(trigger.error)}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {STAGES.map(({ id, label, Icon }) => {
          const runStatus = latestByStage?.[id]?.status;
          const isBusy = active === id;
          const isDone = runStatus === "succeeded";
          const isFailed = runStatus === "failed";

          return (
            <button
              key={id}
              disabled={!!active}
              onClick={() => run(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.95rem",
                border: `1.5px solid ${isBusy ? "var(--crimson)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                background: isBusy ? "var(--crimson-pale)" : "var(--white)",
                cursor: active ? "not-allowed" : "pointer",
                opacity: active && !isBusy ? 0.5 : 1,
                transition: "all var(--transition)",
                fontSize: "0.85rem",
                textAlign: "left",
                width: "100%",
              }}
            >
              <span style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-sm)",
                background: isBusy || isDone ? "var(--crimson)" : "var(--surface-2)",
                color: isBusy || isDone ? "#fff" : "var(--crimson)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isBusy ? <IconLoader size={14} /> : <Icon size={14} />}
              </span>

              <span style={{ flex: 1, fontWeight: 500, color: "var(--text-1)" }}>
                {isBusy ? `Running ${label}…` : label}
              </span>

              {isDone && !isBusy && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  padding: "0.15rem 0.5rem",
                  borderRadius: 999,
                  background: "var(--crimson-pale)",
                  color: "var(--crimson)",
                }}>
                  <IconCheck size={11} />
                  Done
                </span>
              )}

              {isFailed && !isBusy && (
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  padding: "0.15rem 0.5rem",
                  borderRadius: 999,
                  background: "var(--error-bg)",
                  color: "var(--error-text)",
                }}>
                  Failed
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
