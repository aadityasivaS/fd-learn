"use client";

import Link from "next/link";
import { useState } from "react";
import { Moon, Sun, ArrowUpRight, Download } from "lucide-react";
import { downloadPdf, downloadText } from "@/lib/reports/report-generator";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("fdlab-theme") === "dark",
  );
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("fdlab-theme", next ? "dark" : "light");
  }
  function exportGuide() {
    const content =
      "FDLab / Functional Dependency Learning Lab\n\nA browser-only workspace for closures, candidate keys, and canonical covers.";
    downloadText("fdlab-guide.txt", content);
  }
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--ink)] text-sm font-black text-[var(--background)]">
              FD
            </span>
            <span className="font-extrabold tracking-tight">FDLab</span>
            <span className="hidden text-xs text-[var(--muted)] sm:inline">
              learning lab
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--muted)] md:flex">
            <Link href="/learn" className="hover:text-[var(--ink)]">
              Learn
            </Link>
            <Link href="/tools" className="hover:text-[var(--ink)]">
              Tools
            </Link>
            <Link href="/practice" className="hover:text-[var(--ink)]">
              Practice
            </Link>
            <Link href="/help" className="hover:text-[var(--ink)]">
              Help
            </Link>
            <Link href="/developed-by" className="hover:text-[var(--ink)]">
              Developed by
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-full border hover:bg-[var(--panel)]"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={exportGuide}
              className="hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold sm:flex"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mx-auto flex max-w-7xl justify-between border-t px-5 py-7 text-xs text-[var(--muted)]">
        <span>Built for curious database minds.</span>
        <span>Local execution · no account required</span>
      </footer>
    </div>
  );
}

export function CtaLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold transition-transform hover:-translate-y-0.5 ${secondary ? "border bg-[var(--panel)]" : "bg-[var(--ink)] text-[var(--background)]"}`}
    >
      {children}
      <ArrowUpRight size={16} />
    </Link>
  );
}
export function DownloadButtons({
  content,
  name,
}: {
  content: string;
  name: string;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => downloadText(`${name}.txt`, content)}
        className="rounded-full border px-3 py-2 text-xs font-bold"
      >
        TXT
      </button>
      <button
        onClick={() => downloadPdf(`${name}.pdf`, content)}
        className="rounded-full bg-[var(--accent)] px-3 py-2 text-xs font-bold text-white"
      >
        PDF
      </button>
    </div>
  );
}
