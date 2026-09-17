import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  KeyRound,
  Network,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { CtaLink, SiteShell } from "@/components/site-shell";

const features = [
  [
    BookOpen,
    "Learn concepts",
    "Turn notation into intuition with worked traces.",
  ],
  [
    ScanSearch,
    "Calculate closures",
    "Watch attributes accumulate until the fixed point.",
  ],
  [
    KeyRound,
    "Find candidate keys",
    "Test minimal superkeys with deterministic reasoning.",
  ],
  [
    Network,
    "Canonical covers",
    "Simplify dependency sets while preserving implication.",
  ],
];
export default function Home() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16">
        <section className="grid items-end gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">DBMS / interactive studio</p>
            <h1 className="display mt-5 max-w-4xl text-6xl font-black md:text-8xl">
              Make dependencies{" "}
              <span className="text-[var(--accent)]">click.</span>
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-8 text-[var(--muted)]">
              A visual lab for functional dependencies, closures, candidate
              keys, and canonical covers. Learn the idea, then execute it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/learn">Start learning</CtaLink>
              <CtaLink href="/tools/closure" secondary>
                Open tools
              </CtaLink>
            </div>
          </div>
          <div className="panel rounded-[2rem] p-5">
            <p className="eyebrow mb-4">The dependency chain</p>
            {[
              "Functional dependencies",
              "Attribute closure",
              "Superkey detection",
              "Candidate keys",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl font-mono font-bold ${index === 3 ? "bg-[var(--accent)] text-white" : "bg-[var(--ink)] text-[var(--background)]"}`}
                >
                  0{index + 1}
                </div>
                <p className="font-bold">{item}</p>
                {index < 3 && (
                  <ArrowDown
                    size={17}
                    className="ml-auto text-[var(--accent)]"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="mt-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">A calmer way to study</p>
              <h2 className="mt-2 text-3xl font-black">
                Learn by seeing the work.
              </h2>
            </div>
            <Link
              href="/tools"
              className="hidden items-center gap-2 text-sm font-bold md:flex"
            >
              View all tools <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(([Icon, title, text]) => (
              <div className="panel rounded-2xl p-5" key={title as string}>
                <Icon size={23} className="text-[var(--accent)]" />
                <h3 className="mt-8 font-black">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {text as string}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
