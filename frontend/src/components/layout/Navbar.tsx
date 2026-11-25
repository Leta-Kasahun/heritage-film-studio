"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { IconSearch } from "@/components/ui/Icon";

const NAV_LINKS = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.projects, label: "Projects" },
  { href: ROUTES.newProject, label: "Create" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

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
      background: "linear-gradient(90deg, var(--crimson-deep) 0%, var(--crimson) 100%)",
      borderBottom: "1px solid rgba(255,255,255,0.12)",
    }}>
      <div
        className="page-wrap"
        style={{
          minHeight: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          paddingTop: "0.4rem",
          paddingBottom: "0.4rem",
        }}
      >
        <Link
          href={ROUTES.home}
          style={{
            color: "#fff",
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "1.15rem",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          Heritage Film Studio
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: active ? "#fff" : "rgba(255,255,255,0.82)",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                  padding: "0.35rem 0",
                  borderBottom: active ? "2px solid #fff" : "2px solid transparent",
                  transition: "all var(--transition)",
                  whiteSpace: "nowrap",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={handleSearch}
          style={{
            position: "relative",
            flex: "0 1 240px",
            minWidth: 160,
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconSearch
            size={14}
            style={{
              position: "absolute",
              left: 11,
              color: "rgba(255,255,255,0.7)",
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: "var(--radius-md)",
              padding: "0.38rem 0.75rem 0.38rem 2rem",
              fontSize: "0.8rem",
              color: "#fff",
              outline: "none",
            }}
          />
        </form>
      </div>
    </header>
  );
}
