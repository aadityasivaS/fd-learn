import { SiteShell } from "@/components/site-shell";
const sections = [
  [
    "01",
    "Functional dependencies",
    "X → Y means that whenever two rows agree on X, they must agree on Y. X is the determinant; Y is the dependent. Example: Student_ID → Student_Name.",
  ],
  [
    "02",
    "Attribute closure",
    "The closure X+ is every attribute that X can determine by repeatedly applying the dependencies. Start with X, scan the set, and stop at a fixed point.",
  ],
  [
    "03",
    "Superkeys and candidate keys",
    "If X+ contains every relation attribute, X is a superkey. It becomes a candidate key only when no attribute can be removed without losing that property.",
  ],
  [
    "04",
    "Canonical cover",
    "A canonical cover keeps the same implications with less noise: decompose RHS attributes, remove extraneous LHS attributes, then remove redundant dependencies.",
  ],
];
export default function Learn() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-5 py-16">
        <p className="eyebrow">Learn / concept studio</p>
        <h1 className="display mt-4 max-w-4xl text-6xl font-black">
          The logic behind the notation.
        </h1>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {sections.map(([number, title, text]) => (
            <article className="panel rounded-3xl p-7" key={number}>
              <span className="font-mono text-[var(--accent)]">{number}</span>
              <h2 className="mt-8 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
        <section className="mt-12 panel overflow-hidden rounded-3xl">
          <div className="aspect-video bg-[var(--ink)] p-8 text-[var(--background)]">
            <p className="eyebrow">Video placeholder</p>
            <h2 className="mt-20 text-3xl font-black">
              Functional dependencies, explained visually.
            </h2>
            <p className="mt-3 max-w-lg text-sm opacity-70">
              Replace this configurable embed with your chosen educational
              YouTube source. The learning content above is self-contained.
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-black">References</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
              <li>Database System Concepts, Silberschatz, Korth, Sudarshan.</li>
              <li>Fundamentals of Database Systems, Elmasri and Navathe.</li>
              <li>Stanford Database Systems course materials.</li>
            </ul>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
