"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createProject, uploadDocument } from "../services/project-service";
import { triggerPipeline } from "@/features/generation/services/generation-service";
import { OutputType } from "../types";
import { ROUTES } from "@/constants/routes";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  IconFileText,
  IconUpload,
  IconX,
  IconAlertCircle,
  IconMonitor,
  IconSmartphone,
  IconArrowRight,
  IconLoader,
  IconFilm,
  IconMic,
  IconImage,
} from "@/components/ui/Icon";

const LANGUAGES = [
  { value: "am", label: "Amharic (አማርኛ)" },
  { value: "en", label: "English" },
  { value: "om", label: "Afaan Oromo" },
  { value: "ti", label: "Tigrinya (ትግርኛ)" },
  { value: "so", label: "Somali" },
  { value: "fr", label: "French" },
];

const PLACEHOLDERS: Record<string, { title: string; topic: string; story: string }> = {
  am: {
    title: "ለምሳሌ፡ የኢትዮጵያ ቡና ሥነ ሥርዓት",
    topic: "ለምሳሌ፡ የአያቴ የጠዋት ቡና እና የቤተሰብ ወግ",
    story: "ታሪክዎን በአማርኛ እዚህ ይጻፉ ወይም ከታች ፋይል ይጫኑ…",
  },
  en: {
    title: "e.g. Grandmother's Market Road",
    topic: "e.g. The weekly market in Dessie, 1970s",
    story: "Write your family story here or upload a document below…",
  },
  om: {
    title: "Fakkeenyaaf: Seenaa Bunaa Maatii Keenyaa",
    topic: "Fakkeenyaaf: Gabaa ganamaa magaalaa Jimmaa",
    story: "Seenaa keessan asitti barreessaa yookiin galmee olkaa'aa…",
  },
  ti: {
    title: "ንኣብነት፡ ናይ ኣያና ቡን ባህሊ",
    topic: "ንኣብነት፡ ናይ ኣኽሱም ዕዳጋ ንግሆ",
    story: "ታሪኽኩም ኣብዚ ጽሓፉ ወይ ፋይል ኣእትዉ…",
  },
  so: {
    title: "Tusaale: Sheekadii Ayeeyo",
    topic: "Tusaale: Suuqa subaxda iyo dhaqanka qoyska",
    story: "Halkan ku qor sheekadaada ama soo geli dukumeenti…",
  },
  fr: {
    title: "ex. La route du marché de grand-mère",
    topic: "ex. Le marché hebdomadaire et nos traditions",
    story: "Écrivez votre histoire ici ou importez un document…",
  },
};

type AspectChoice = "16:9" | "9:16";

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [heritageTopic, setHeritageTopic] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("am");
  const [outputType, setOutputType] = useState<OutputType>("video");
  const [aspectRatio, setAspectRatio] = useState<AspectChoice>("16:9");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ph = PLACEHOLDERS[language] ?? PLACEHOLDERS.en;

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !heritageTopic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const project = await createProject({
        title,
        heritage_topic: heritageTopic,
        description: description || undefined,
        language_code: language,
        settings: {
          output_type: outputType,
          aspect_ratios: [aspectRatio],
        },
      });
      if (file) await uploadDocument(project.id, file);
      await triggerPipeline(project.id, "auto");
      router.push(ROUTES.project(project.id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--error-bg)",
          color: "var(--error-text)",
          borderRadius: "var(--radius-md)",
          padding: "0.75rem 1rem",
          fontSize: "0.85rem",
        }}>
          <IconAlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="field-label">
          Title <span style={{ color: "var(--crimson)" }}>*</span>
        </label>
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ph.title}
          required
        />
      </div>

      <div>
        <label className="field-label">
          Heritage topic <span style={{ color: "var(--crimson)" }}>*</span>
        </label>
        <input
          className="input"
          type="text"
          value={heritageTopic}
          onChange={(e) => setHeritageTopic(e.target.value)}
          placeholder={ph.topic}
          required
        />
      </div>

      <div>
        <label className="field-label">Story or notes</label>
        <textarea
          className="input"
          style={{ resize: "none" }}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={ph.story}
        />
      </div>

      <div>
        <label className="field-label">What would you like to generate?</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {([
            ["video", IconFilm, "Video"],
            ["audio", IconMic, "Audio"],
            ["image", IconImage, "Images"],
          ] as const).map(([type, Icon, label]) => {
            const active = outputType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setOutputType(type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: `1.5px solid ${active ? "var(--crimson)" : "var(--border)"}`,
                  background: active ? "var(--crimson-pale)" : "var(--white)",
                  color: active ? "var(--crimson)" : "var(--text-2)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  transition: "all var(--transition)",
                }}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div>
          <label className="field-label">Language</label>
          <CustomSelect
            value={language}
            onChange={setLanguage}
            options={LANGUAGES}
            label="Language"
          />
        </div>

        {outputType !== "audio" && (
          <div>
            <label className="field-label">Format</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {([
                ["16:9", IconMonitor, "Horizontal", "16:9"],
                ["9:16", IconSmartphone, "Vertical", "9:16"],
              ] as const).map(([ratio, Icon, label, sub]) => {
                const active = aspectRatio === ratio;
                return (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.7rem",
                      borderRadius: "var(--radius-md)",
                      border: `1.5px solid ${active ? "var(--crimson)" : "var(--border)"}`,
                      background: active ? "var(--crimson-pale)" : "var(--white)",
                      color: active ? "var(--crimson)" : "var(--text-2)",
                      textAlign: "left",
                      transition: "all var(--transition)",
                    }}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: "0.68rem", opacity: 0.75 }}>{sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="field-label">
          Story document <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(PDF, DOCX, TXT · optional)</span>
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `1.5px dashed ${dragging ? "var(--crimson)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)",
            padding: "1.25rem 1rem",
            textAlign: "center",
            background: dragging ? "var(--crimson-pale)" : "var(--surface-1)",
            transition: "all var(--transition)",
          }}
        >
          {file ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
              <IconFileText size={16} style={{ color: "var(--crimson)" }} />
              <span style={{ fontWeight: 500, color: "var(--text-1)" }}>{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                aria-label="Remove file"
                style={{ background: "none", border: "none", color: "var(--text-3)", display: "inline-flex", padding: 2 }}
              >
                <IconX size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem" }}>
              <IconUpload size={20} style={{ color: "var(--crimson)" }} />
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                Drag &amp; drop your document here, or{" "}
                <label style={{ color: "var(--crimson)", fontWeight: 600, cursor: "pointer" }}>
                  browse
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim() || !heritageTopic.trim()}
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", padding: "0.75rem 1.25rem", marginTop: "0.25rem" }}
      >
        {loading ? (
          <>
            <IconLoader size={15} />
            Starting generation…
          </>
        ) : (
          <>
            Generate {outputType === "video" ? "Video" : outputType === "audio" ? "Audio" : "Images"}
            <IconArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}
