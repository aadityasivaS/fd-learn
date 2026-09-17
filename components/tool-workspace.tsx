"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { calculateClosure } from "@/lib/algorithms/closure";
import { findCandidateKeys } from "@/lib/algorithms/candidate-keys";
import { findCanonicalCover } from "@/lib/algorithms/canonical-cover";
import {
  formatFd,
  normalizeAttributes,
  parseFunctionalDependencies,
} from "@/lib/parser/fd-parser";
import { DownloadButtons } from "@/components/site-shell";

type Kind = "closure" | "keys" | "cover";
const examples = {
  closure: {
    relation: "A, B, C, D, E",
    fds: "A -> B\nB -> C\nCD -> E",
    attrs: "A",
  },
  keys: {
    relation: "A, B, C, D, E",
    fds: "A -> B\nB -> C\nCD -> E\nE -> A",
    attrs: "",
  },
  cover: {
    relation: "A, B, C, D, E",
    fds: "A -> BC\nAB -> D\nB -> D\nD -> E",
    attrs: "",
  },
};

export function ToolWorkspace({ kind }: { kind: Kind }) {
  const example = examples[kind];
  const [relationText, setRelationText] = useState(example.relation);
  const [fdText, setFdText] = useState(example.fds);
  const [attributeText, setAttributeText] = useState(example.attrs);
  const [error, setError] = useState("");
  const [ran, setRan] = useState(false);
  const [step, setStep] = useState(0);
  const dependencies = useMemo(() => {
    try {
      return parseFunctionalDependencies(fdText);
    } catch {
      return [];
    }
  }, [fdText]);
  const relation = normalizeAttributes(relationText);
  const closure =
    kind === "closure" && ran
      ? calculateClosure(normalizeAttributes(attributeText), dependencies)
      : null;
  const keys =
    kind === "keys" && ran ? findCandidateKeys(relation, dependencies) : null;
  const cover =
    kind === "cover" && ran ? findCanonicalCover(dependencies) : null;
  const title =
    kind === "closure"
      ? "Attribute closure"
      : kind === "keys"
        ? "Candidate key finder"
        : "Canonical cover";
  function run() {
    try {
      parseFunctionalDependencies(fdText);
      if (!relation.length) throw new Error("Relation cannot be empty.");
      if (kind === "closure" && !attributeText.trim())
        throw new Error("Attribute set cannot be empty.");
      setError("");
      setRan(true);
      setStep(0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Check your input.");
    }
  }
  function exampleInput() {
    setRelationText(example.relation);
    setFdText(example.fds);
    setAttributeText(example.attrs);
    setError("");
  }
  const report = `FDLab ${title} Report\nRelation: ${relation.join(", ")}\nFDs:\n${fdText}\n\nResult: ${closure ? closure.closure.join(", ") : keys ? keys.keys.map((key) => key.join("")).join(", ") : cover ? cover.cover.map(formatFd).join(", ") : "Not run"}`;
  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">
            Interactive tool / 0
            {kind === "closure" ? 1 : kind === "keys" ? 2 : 3}
          </p>
          <h1 className="display mt-3 text-5xl font-black md:text-7xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
            See the algorithm work, not just the answer.
          </p>
        </div>
        <DownloadButtons content={report} name={`fdlab-${kind}`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
        <section className="panel rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-extrabold">Inputs</h2>
            <button
              onClick={exampleInput}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold"
            >
              <Sparkles size={14} /> Use example
            </button>
          </div>
          <label className="field-label">Relation attributes</label>
          <input
            value={relationText}
            onChange={(event) => setRelationText(event.target.value)}
            className="field"
            placeholder="A, B, C, D"
          />
          <label className="field-label mt-5">Functional dependencies</label>
          <textarea
            value={fdText}
            onChange={(event) => setFdText(event.target.value)}
            className="field min-h-36"
            placeholder="A -> B"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            One dependency per line. Use <code>AB -&gt; C</code> for compound
            determinants.
          </p>
          {kind === "closure" && (
            <>
              <label className="field-label mt-5">Attribute set X</label>
              <input
                value={attributeText}
                onChange={(event) => setAttributeText(event.target.value)}
                className="field"
                placeholder="A"
              />
            </>
          )}
          <button
            onClick={run}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-extrabold text-white"
          >
            <Play size={16} />{" "}
            {kind === "cover"
              ? "Generate canonical cover"
              : kind === "keys"
                ? "Find candidate keys"
                : "Calculate closure"}
          </button>
          {error && (
            <div className="mt-4 flex gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </section>
        <section className="panel min-h-[470px] rounded-3xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow">Execution trace</p>
              <h2 className="mt-1 text-2xl font-black">
                {ran ? "Algorithm in motion" : "Ready when you are"}
              </h2>
            </div>
            {ran && (
              <button
                onClick={() => {
                  setRan(false);
                  setStep(0);
                }}
                className="grid h-9 w-9 place-items-center rounded-full border"
                aria-label="Restart"
              >
                <RotateCcw size={15} />
              </button>
            )}
          </div>
          {!ran && <EmptyState />}
          {closure && (
            <ClosureTrace
              result={closure}
              step={step}
              setStep={setStep}
              label={`${attributeText}+`}
            />
          )}
          {keys && <KeyResult result={keys} />}
          {cover && (
            <CoverResult result={cover} step={step} setStep={setStep} />
          )}
        </section>
      </div>
    </div>
  );
}
function EmptyState() {
  return (
    <div className="grid h-80 place-items-center rounded-2xl border border-dashed text-center text-[var(--muted)]">
      <div>
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent-2)]/20 text-2xl">
          ∴
        </div>
        <p>
          Enter a relation and dependencies.
          <br />
          The trace will appear here.
        </p>
      </div>
    </div>
  );
}
function ClosureTrace({
  result,
  step,
  setStep,
  label,
}: {
  result: ReturnType<typeof calculateClosure>;
  step: number;
  setStep: (value: number) => void;
  label: string;
}) {
  const current = result.steps[step];
  return (
    <div>
      <div className="mb-5 flex justify-between text-xs font-bold text-[var(--muted)]">
        <span>STEP {step}</span>
        <span>
          {step === result.steps.length - 1 ? "FIXED POINT" : "DEPENDENCY PASS"}
        </span>
      </div>
      <div className="rounded-2xl bg-[var(--ink)] p-6 text-[var(--background)]">
        <p className="font-mono text-sm text-[var(--accent-2)]">
          {current.fdApplied ?? "Initial closure"}
        </p>
        <p className="my-6 font-mono text-3xl font-bold">{`{${current.after.join(", ")}}`}</p>
        {current.addedAttributes.length > 0 && (
          <p className="text-sm">
            Added{" "}
            <b className="text-[var(--accent-2)]">
              {current.addedAttributes.join(", ")}
            </b>
          </p>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <button
          disabled={!step}
          onClick={() => setStep(step - 1)}
          className="step-button"
          aria-label="Previous step"
        >
          <ChevronLeft size={15} /> Previous
        </button>
        <span className="text-sm text-[var(--muted)]">
          {label} ={" "}
          <b className="text-[var(--ink)]">{`{${result.closure.join(", ")}}`}</b>
        </span>
        <button
          disabled={step >= result.steps.length - 1}
          onClick={() => setStep(step + 1)}
          className="step-button"
          aria-label="Next step"
        >
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
function KeyResult({
  result,
}: {
  result: ReturnType<typeof findCandidateKeys>;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-[var(--muted)]">
        {result.explored.length} deterministic sets explored.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.keys.map((key) => (
          <div
            className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent)]/10 p-5"
            key={key.join("")}
          >
            <p className="eyebrow">Candidate key</p>
            <p className="mt-2 font-mono text-3xl font-black">{key.join("")}</p>
            <p className="mt-2 text-sm">
              Closure:{" "}
              {result.reasoning
                .find((item) => item.key.join("") === key.join(""))
                ?.closure.join("")}
            </p>
          </div>
        ))}
      </div>
      <details className="mt-6 rounded-xl border p-4">
        <summary className="cursor-pointer text-sm font-bold">
          Show exploration log
        </summary>
        <div className="mt-3 space-y-2 font-mono text-xs text-[var(--muted)]">
          {result.explored.map((item) => (
            <p key={item.set.join("")}>
              {item.set.join("") || "∅"}+ = {item.closure.join("")}{" "}
              {item.superkey ? "· superkey" : "· not a superkey"}
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}
function CoverResult({
  result,
  step,
  setStep,
}: {
  result: ReturnType<typeof findCanonicalCover>;
  step: number;
  setStep: (value: number) => void;
}) {
  const stage = result.stages[step];
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {result.stages.map((item, index) => (
          <button
            onClick={() => setStep(index)}
            key={item.title}
            className={`flex-1 rounded-lg px-2 py-3 text-left text-xs font-bold ${index === step ? "bg-[var(--accent)] text-white" : "border"}`}
          >
            <span className="block opacity-60">0{index + 1}</span>
            {item.title}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border p-5">
        <p className="eyebrow">Stage {step + 1}</p>
        <h3 className="mt-1 text-xl font-black">{stage.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{stage.description}</p>
        <div className="my-5 flex flex-wrap gap-2">
          {stage.dependencies.map((fd, index) => (
            <span
              className="rounded-lg bg-[var(--ink)] px-3 py-2 font-mono text-sm text-[var(--background)]"
              key={`${formatFd(fd)}-${index}`}
            >
              {formatFd(fd)}
            </span>
          ))}
        </div>
        <div className="space-y-2 border-t pt-4 text-sm text-[var(--muted)]">
          {stage.details.map((detail) => (
            <p key={detail} className="flex gap-2">
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-[var(--accent)]"
              />
              {detail}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
