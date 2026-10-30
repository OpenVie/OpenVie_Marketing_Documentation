"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { href: "#getting-started", label: "Bắt đầu" },
  { href: "#authentication", label: "Xác thực" },
  { href: "#reference", label: "API Reference" },
];

export default function DocumentationHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="ov-docs-header sticky top-0 z-30 border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          OpenVie <span className="text-lime-300">API</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-lime-300">{item.label}</a>
            ))}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="ov-menu-button md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="ov-mobile-navigation md:hidden" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
