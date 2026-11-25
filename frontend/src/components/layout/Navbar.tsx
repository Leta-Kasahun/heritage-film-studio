"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { IconFilm, IconPlus, IconSearch } from "@/components/ui/Icon";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const isFilms = pathname.startsWith(ROUTES.projects) && pathname !== ROUTES.newProject;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `${ROUTES.projects}?q=${encodeURIComponent(trimmed)}` : ROUTES.projects);
  }

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "linear-gradient(180deg, rgba(20, 4, 8, 0.96) 0%, rgba(120, 12, 32, 0.92) 100%)",
      backdropFilter: "blur(10px)",
    }}>
      <div
        className="page-wrap"
        style={{
          minHeight: 62,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
          flexWrap: "wrap",
          paddingTop: "0.45rem",
          paddingBottom: "0.45rem",
        }}
      >
        <Link
          href={ROUTES.home}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.55rem",
            color: "#fff",
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
        >
          <IconFilm size={19} style={{ color: "var(--crimson)" }} />
          Heritage Film Studio
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.4rem", marginLeft: "auto" }}>
          <Link
            href={ROUTES.projects}
            style={{
              color: isFilms ? "#fff" : "rgba(255,255,255,0.78)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: isFilms ? 600 : 500,
              letterSpacing: "0.02em",
              transition: "color var(--transition)",
              whiteSpace: "nowrap",
            }}
          >
            Films
          </Link>

          <form
            onSubmit={handleSearch}
            style={{
              position: "relative",
              flex: "0 1 220px",
              minWidth: 150,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconSearch
              size={14}
              style={{
                position: "absolute",
                left: 11,
                color: "rgba(255,255,255,0.65)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search films..."
              aria-label="Search films"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "0.42rem 0.75rem 0.42rem 2rem",
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                color: "#fff",
                outline: "none",
              }}
            />
          </form>

          <Link
            href={ROUTES.newProject}
            className="btn btn-primary"
            style={{ fontSize: "0.82rem", padding: "0.42rem 0.95rem" }}
          >
            <IconPlus size={14} />
            Create Film
          </Link>
        </nav>
      </div>
    </header>
  );
}
