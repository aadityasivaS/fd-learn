import { Clock3, Trophy } from "lucide-react";
import type { QuizDifficulty } from "@/types/quiz";

export function QuizTimer({
  seconds,
  enabled = true,
}: {
  seconds: number;
  enabled?: boolean;
}) {
  if (!enabled) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono ${seconds <= 60 ? "border-red-400 text-red-600" : ""}`}
    >
      <Clock3 size={14} /> {formatTime(seconds)}
    </span>
  );
}

export function QuizScorecard({
  total,
  score,
  answeredCount,
  difficulty,
  timedOut,
  onRestart,
  title = "Your scorecard",
}: {
  total: number;
  score: number;
  answeredCount: number;
  difficulty: QuizDifficulty | string;
  timedOut: boolean;
  onRestart: () => void;
  title?: string;
}) {
  const incorrect = answeredCount - score;
  const unanswered = total - answeredCount;
  const percentage = total ? Math.round((score / total) * 100) : 0;
  return (
    <section className="panel mt-12 rounded-3xl p-7">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Trophy size={27} />
        </div>
        <div>
          <p className="eyebrow">Quiz complete</p>
          <h2 className="mt-1 text-3xl font-black">{title}</h2>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-[var(--ink)] p-6 text-[var(--background)]">
        <p className="text-sm opacity-70">Final score</p>
        <p className="mt-2 text-6xl font-black">{percentage}%</p>
        <p className="mt-2 text-sm opacity-70">
          {score} of {total} questions correct · {difficulty} difficulty
        </p>
        {timedOut && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-400/20 px-3 py-1 text-xs font-bold text-red-200">
            <Clock3 size={14} /> Time expired
          </p>
        )}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ScoreStat label="Correct" value={score} tone="text-green-700" />
        <ScoreStat label="Incorrect" value={incorrect} tone="text-red-700" />
        <ScoreStat
          label="Unanswered"
          value={unanswered}
          tone="text-[var(--muted)]"
        />
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="mt-7 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--background)]"
      >
        Build another quiz
      </button>
    </section>
  );
}

function ScoreStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}
