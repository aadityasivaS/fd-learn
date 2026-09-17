"use client";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
const questions = [
  {
    prompt: "For F = { A → B, B → C }, what is A+?",
    answer: "ABC",
    hint: "Start with A and apply dependencies whose LHS is inside the closure.",
  },
  {
    prompt: "For R(A,B,C), A → B and B → C, is A a candidate key?",
    answer: "Yes",
    hint: "Calculate A+ and then test minimality.",
  },
];
export default function Practice() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const question = questions[index];
  const correct =
    answer
      .trim()
      .replace(/[{}, ]/g, "")
      .toUpperCase() === question.answer.toUpperCase();
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="eyebrow">Practice / retrieval mode</p>
        <h1 className="display mt-4 text-6xl font-black">
          Try the reasoning yourself.
        </h1>
        <div className="panel mt-12 rounded-3xl p-7">
          <div className="flex justify-between text-xs font-bold text-[var(--muted)]">
            <span>QUESTION 0{index + 1}</span>
            <span>FOUNDATIONS</span>
          </div>
          <h2 className="mt-10 text-2xl font-black">{question.prompt}</h2>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mt-8 w-full rounded-xl border bg-transparent px-4 py-3 font-mono outline-none"
            placeholder="Your answer"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setSubmitted(true)}
              className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white"
            >
              Submit
            </button>
            <button
              onClick={() => alert(question.hint)}
              className="rounded-full border px-5 py-3 text-sm font-bold"
            >
              Hint
            </button>
            <button
              onClick={() => {
                setIndex((index + 1) % questions.length);
                setAnswer("");
                setSubmitted(false);
              }}
              className="rounded-full border px-5 py-3 text-sm font-bold"
            >
              Next question
            </button>
          </div>
          {submitted && (
            <div
              className={`mt-6 rounded-2xl p-4 text-sm ${correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
            >
              {correct
                ? "Correct. Nice closure reasoning."
                : `Not quite. The answer is ${question.answer}.`}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
