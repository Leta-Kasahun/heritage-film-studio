import { UploadForm } from "@/features/projects/components/UploadForm";

export default function NewProjectPage() {
  return (
    <>
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0" }}>
        <div className="page-wrap" style={{ maxWidth: 640 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}>
            Create Heritage Film
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-3)", marginTop: "0.25rem" }}>
            Add your story details, choose your language and video format, and upload a document.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--surface-1)", padding: "2rem 0 3.5rem", minHeight: "65vh" }}>
        <div className="page-wrap" style={{ maxWidth: 640 }}>
          <div
            className="card"
            style={{
              overflow: "hidden",
              borderTop: "3px solid var(--crimson)",
            }}
          >
            <div style={{ padding: "1.75rem" }}>
              <UploadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
