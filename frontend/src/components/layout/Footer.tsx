import { Reveal } from "@/components/ui/Reveal";

export function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(90deg, var(--crimson-deep) 0%, var(--crimson) 100%)",
      color: "rgba(255,255,255,0.88)",
    }}>
      <Reveal>
        <div
          className="page-wrap"
          style={{
            padding: "1.35rem 1rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: "1 1 260px" }}>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.22)", maxWidth: 120 }} />
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.95rem", color: "#fff", whiteSpace: "nowrap" }}>
              Preserve &nbsp;·&nbsp; Create &nbsp;·&nbsp; Inspire
            </p>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.22)", maxWidth: 120 }} />
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>
              Heritage Film Studio
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.75)" }}>
              Stories that transcend generations
            </p>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
