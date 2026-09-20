"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Lightbulb,
  LoaderCircle,
  RotateCcw,
  Send,
  Settings2,
  XCircle,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { QuizScorecard, QuizTimer } from "@/components/quiz-components";
import type {
  GenerateQuizResponse,
  GradeQuizResponse,
  QuizDifficulty,
  QuizQuestion,
} from "@/types/quiz";

const difficulties: {
  value: QuizDifficulty;
  label: string;
  description: string;
}[] = [
  { value: "easy", label: "Easy", description: "One-step foundations" },
  { value: "medium", label: "Medium", description: "Connected reasoning" },
  { value: "hard", label: "Hard", description: "Multi-stage proofs" },
];

export default function Practice() {
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("medium");
  const [timerDuration, setTimerDuration] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [quiz, setQuiz] = useState<GenerateQuizResponse | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [grades, setGrades] = useState<Record<string, GradeQuizResponse>>({});
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);
  const question = quiz?.questions[index];
  const grade = question ? grades[question.id] : undefined;
  const score = Object.values(grades).filter((result) => result.correct).length;
  const answeredCount = quiz ? Object.keys(grades).length : 0;
  const quizComplete =
    Boolean(quiz) && (timedOut || answeredCount === quiz?.questions.length);

  useEffect(() => {
    if (!quiz || timerDuration === 0 || timedOut || quizComplete) return;
    const interval = window.setInterval(() => {
      setTimerRemaining((current) => {
        if (current <= 1) {
          setTimedOut(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [quiz, timerDuration, timedOut, quizComplete]);

  async function generateQuiz() {
    setLoading(true);
    setError("");
    setQuiz(null);
    setGrades({});
    setAnswer("");
    setIndex(0);
    setShowHint(false);
    setTimerRemaining(timerDuration);
    setTimedOut(false);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount, difficulty }),
      });
      const data = (await response.json()) as GenerateQuizResponse & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error ?? "Quiz generation failed.");
      setQuiz(data);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Quiz generation failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!question || !answer.trim() || grade) return;
    setGrading(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gradingToken: question.gradingToken, answer }),
      });
      const data = (await response.json()) as GradeQuizResponse & {
        error?: string;
      };
      if (!response.ok)
        throw new Error(data.error ?? "Could not grade this answer.");
      setGrades((current) => ({ ...current, [question.id]: data }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not grade this answer.",
      );
    } finally {
      setGrading(false);
    }
  }

  function nextQuestion() {
    if (!quiz) return;
    setIndex((current) => Math.min(current + 1, quiz.questions.length - 1));
    setAnswer("");
    setShowHint(false);
  }
  function restart() {
    setQuiz(null);
    setGrades({});
    setAnswer("");
    setError("");
    setIndex(0);
    setTimerRemaining(0);
    setTimedOut(false);
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <p className="eyebrow">Practice / Gemini quiz studio</p>
        <h1 className="display mt-4 text-6xl font-black">
          Reason with a little pressure.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
          Generate a fresh functional-dependency quiz, choose your pace, and get
          explanations after each answer. Questions are created and graded
          securely on the server.
        </p>
        {!quiz ? (
          <SetupCard
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            timerDuration={timerDuration}
            setTimerDuration={setTimerDuration}
            loading={loading}
            onGenerate={generateQuiz}
            error={error}
          />
        ) : quizComplete ? (
          <QuizScorecard
            total={quiz.questions.length}
            score={score}
            answeredCount={answeredCount}
            difficulty={quiz.difficulty}
            timedOut={timedOut}
            onRestart={restart}
          />
        ) : (
          <QuizCard
            question={question!}
            index={index}
            total={quiz.questions.length}
            difficulty={quiz.difficulty}
            answer={answer}
            setAnswer={setAnswer}
            grade={grade}
            score={score}
            showHint={showHint}
            setShowHint={setShowHint}
            grading={grading}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
            onRestart={restart}
            error={error}
            timerRemaining={timerRemaining}
            timerEnabled={timerDuration > 0}
          />
        )}
      </div>
    </SiteShell>
  );
}

function SetupCard({
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  timerDuration,
  setTimerDuration,
  loading,
  onGenerate,
  error,
}: {
  questionCount: number;
  setQuestionCount: (value: number) => void;
  difficulty: QuizDifficulty;
  setDifficulty: (value: QuizDifficulty) => void;
  timerDuration: number;
  setTimerDuration: (value: number) => void;
  loading: boolean;
  onGenerate: () => void;
  error: string;
}) {
  return (
    <section className="panel mt-12 rounded-3xl p-7">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Settings2 size={21} />
        </div>
        <div>
          <h2 className="text-2xl font-black">
            Build your quiz powered by Gemini
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Gemini will create functional-dependency questions from these
            settings.
          </p>
        </div>
      </div>
      <label className="field-label mt-8">Number of questions</label>
      <div className="flex flex-wrap gap-2">
        {[3, 5, 10, 15].map((count) => (
          <button
            type="button"
            onClick={() => setQuestionCount(count)}
            key={count}
            className={`rounded-xl border px-5 py-3 text-sm font-bold ${questionCount === count ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
          >
            {count}
          </button>
        ))}
      </div>
      <label className="field-label mt-8">Difficulty</label>
      <div className="grid gap-2 sm:grid-cols-3">
        {difficulties.map((item) => (
          <button
            type="button"
            onClick={() => setDifficulty(item.value)}
            key={item.value}
            className={`rounded-xl border p-4 text-left ${difficulty === item.value ? "border-[var(--accent)] bg-[var(--accent)]/10" : ""}`}
          >
            <span className="block font-bold">{item.label}</span>
            <span className="mt-1 block text-xs text-[var(--muted)]">
              {item.description}
            </span>
          </button>
        ))}
      </div>
      <label className="field-label mt-8">Timer</label>
      <div className="grid gap-2 sm:grid-cols-4">
        {[
          { value: 0, label: "Off" },
          { value: 300, label: "5 min" },
          { value: 600, label: "10 min" },
          { value: 900, label: "15 min" },
        ].map((item) => (
          <button
            type="button"
            onClick={() => setTimerDuration(item.value)}
            key={item.value}
            className={`rounded-xl border p-3 text-sm font-bold ${timerDuration === item.value ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-extrabold text-white disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle className="animate-spin" size={17} /> Creating
            questions...
          </>
        ) : (
          "Generate interactive quiz"
        )}
      </button>
      {error && <ErrorMessage message={error} />}
    </section>
  );
}

function QuizCard({
  question,
  index,
  total,
  difficulty,
  answer,
  setAnswer,
  grade,
  score,
  showHint,
  setShowHint,
  grading,
  onSubmit,
  onNext,
  onRestart,
  error,
  timerRemaining,
  timerEnabled,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  difficulty: QuizDifficulty;
  answer: string;
  setAnswer: (value: string) => void;
  grade?: GradeQuizResponse;
  score: number;
  showHint: boolean;
  setShowHint: (value: boolean) => void;
  grading: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
  error: string;
  timerRemaining: number;
  timerEnabled: boolean;
}) {
  const finished = Boolean(grade) && index === total - 1;
  return (
    <section className="panel mt-12 rounded-3xl p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[var(--muted)]">
        <span>
          QUESTION {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <span className="rounded-full border px-3 py-1 uppercase">
          {difficulty} · {score} correct
        </span>
        <QuizTimer seconds={timerRemaining} enabled={timerEnabled} />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <div className="mt-10 flex items-start justify-between gap-4">
        <h2 className="max-w-2xl text-2xl font-black leading-tight">
          {question.prompt}
        </h2>
        <span className="hidden rounded-lg bg-[var(--ink)] px-2 py-1 font-mono text-[10px] text-[var(--background)] sm:inline">
          {question.topic}
        </span>
      </div>
      {question.options ? (
        <div className="mt-8 space-y-2">
          {question.options.map((option) => (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-semibold ${answer === option ? "border-[var(--accent)] bg-[var(--accent)]/10" : ""}`}
            >
              <input
                type="radio"
                name={question.id}
                checked={answer === option}
                onChange={() => setAnswer(option)}
                disabled={Boolean(grade)}
                className="accent-[var(--accent)]"
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={Boolean(grade)}
          className="field mt-8"
          placeholder="Type your answer"
        />
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
        >
          <Lightbulb size={15} /> {showHint ? "Hide hint" : "Hint"}
        </button>
        {!grade && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={grading || !answer.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {grading ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              <Send size={15} />
            )}{" "}
            Submit answer
          </button>
        )}
        {grade && !finished && (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-bold text-[var(--background)]"
          >
            Next question
          </button>
        )}
        {finished && (
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-bold text-[var(--background)]"
          >
            <RotateCcw size={15} /> New quiz
          </button>
        )}
      </div>
      {showHint && (
        <div className="mt-4 rounded-2xl border border-[var(--accent-2)] bg-[var(--accent-2)]/10 p-4 text-sm">
          <b>Hint:</b> {question.hint}
        </div>
      )}
      {grade && (
        <div
          className={`mt-6 flex gap-3 rounded-2xl p-4 text-sm ${grade.correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
        >
          {grade.correct ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
          <div>
            <b>{grade.correct ? "Correct." : "Not quite."}</b>
            <p className="mt-1">{grade.explanation}</p>
          </div>
        </div>
      )}
      {error && <ErrorMessage message={error} />}
    </section>
  );
}
function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
