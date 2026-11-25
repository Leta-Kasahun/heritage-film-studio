"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronDown, IconCheck } from "@/components/ui/Icon";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
}

export function CustomSelect({ value, onChange, options, label }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          background: "var(--white)",
          border: `1px solid ${open ? "var(--crimson)" : "var(--border)"}`,
          boxShadow: open ? "0 0 0 2px rgba(220,20,60,0.12)" : "none",
          borderRadius: "var(--radius-md)",
          padding: "0.6rem 0.85rem",
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          color: "var(--text-1)",
          textAlign: "left",
          transition: "border-color var(--transition), box-shadow var(--transition)",
        }}
      >
        <span>{selected?.label}</span>
        <IconChevronDown
          size={15}
          style={{
            color: open ? "var(--crimson)" : "var(--text-3)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--transition)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            listStyle: "none",
            padding: "0.3rem",
            maxHeight: 220,
            overflowY: "auto",
            animation: "fadeIn 0.14s ease",
          }}
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    padding: "0.5rem 0.7rem",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: active ? "var(--crimson-pale)" : "transparent",
                    color: active ? "var(--crimson)" : "var(--text-1)",
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.85rem",
                    textAlign: "left",
                    transition: "background var(--transition)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "var(--surface-1)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span>{opt.label}</span>
                  {active && <IconCheck size={14} style={{ color: "var(--crimson)", flexShrink: 0 }} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
