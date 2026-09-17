import { SiteShell } from "@/components/site-shell";
export default function DevelopedBy() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <p className="eyebrow">The people behind the lab</p>
        <h1 className="display mt-4 text-6xl font-black">Developed by.</h1>
        <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
          A professional space for the project team. Replace the placeholders
          below with the approved student details and photographs.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Aadityasiva S", regno: "25BCE1879" },
            { name: "Boyina Suryaa", regno: "25BCE1867" },
          ].map((name, index) => (
            <div className="panel rounded-3xl p-5" key={index}>
              <div className="grid aspect-square place-items-center rounded-2xl bg-[var(--ink)] text-4xl text-[var(--background)]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-5 font-black">{name.name}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{name.regno}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border-l-4 border-[var(--accent)] bg-[var(--panel)] p-6">
          <p className="eyebrow">Guided by</p>
          <h2 className="mt-2 text-2xl font-black">Dr. Swaminathan A</h2>
          <p className="mt-1 text-[var(--muted)]">Assistant Professor</p>
        </div>
      </div>
    </SiteShell>
  );
}
