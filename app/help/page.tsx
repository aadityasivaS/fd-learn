import { SiteShell } from "@/components/site-shell";
const steps = [
  "Enter relation attributes as A, B, C or ABC.",
  "Enter one dependency per line, such as AB -> C.",
  "Choose a tool and load the example to see a valid starting point.",
  "Run the algorithm. Use Previous and Next to inspect the execution trace.",
  "Use TXT or PDF to download the current inputs and result.",
  "Switch Day/Night from the moon button in the navigation.",
  "On Practice, choose a question count and difficulty, then generate a Gemini quiz.",
  "Submit each answer to receive server-graded feedback and an explanation.",
];
export default function Help() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <p className="eyebrow">Help / field guide</p>
        <h1 className="display mt-4 text-6xl font-black">
          A quick manual for the lab.
        </h1>
        <div className="mt-12 space-y-3">
          {steps.map((step, index) => (
            <div className="panel flex gap-5 rounded-2xl p-5" key={step}>
              <span className="font-mono font-bold text-[var(--accent)]">
                0{index + 1}
              </span>
              <p className="font-semibold leading-6">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl bg-[var(--ink)] p-7 text-[var(--background)]">
          <h2 className="text-2xl font-black">Common input errors</h2>
          <p className="mt-3 text-sm leading-7 opacity-75">
            Missing relation attributes, malformed arrows, empty left or right
            sides, duplicate attributes, and attributes outside the relation are
            all worth checking before you run.
          </p>
        </div>
        <div className="panel mt-6 rounded-3xl p-7">
          <h2 className="text-2xl font-black">Gemini Practice setup</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Copy <code>.env.example</code> to <code>.env.local</code> and add a
            server-only
            <code> GEMINI_API_KEY</code>. Add a long random{" "}
            <code>QUIZ_SIGNING_SECRET</code>
            as well. Never prefix either value with <code>NEXT_PUBLIC_</code>.
            The browser receives questions and encrypted grading tokens, while
            answers remain on the server.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
