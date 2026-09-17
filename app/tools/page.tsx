import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
const tools = [
  [
    "01",
    "Attribute closure",
    "Calculate X+ and inspect every dependency application.",
    "/tools/closure",
  ],
  [
    "02",
    "Candidate keys",
    "Discover minimal superkeys and inspect the proof.",
    "/tools/candidate-keys",
  ],
  [
    "03",
    "Canonical cover",
    "Decompose, reduce, and preserve implication.",
    "/tools/canonical-cover",
  ],
];
export default function Tools() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <p className="eyebrow">The workbench</p>
        <h1 className="display mt-4 max-w-3xl text-6xl font-black">
          Three tools. One dependency mindset.
        </h1>
        <div className="mt-12 grid gap-4">
          {tools.map(([number, title, text, href]) => (
            <Link
              href={href}
              key={href}
              className="panel group grid gap-4 rounded-3xl p-6 md:grid-cols-[80px_1fr_auto] md:items-center"
            >
              <span className="font-mono text-2xl text-[var(--accent)]">
                {number}
              </span>
              <div>
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="mt-1 text-[var(--muted)]">{text}</p>
              </div>
              <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
