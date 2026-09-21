"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  Play,
  RotateCcw,
  Send,
  Settings2,
  XCircle,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { QuizScorecard, QuizTimer } from "@/components/quiz-components";

type Option = { label: string; text: string };
type ExamQuestion = {
  id: string;
  exam: string;
  year: number;
  questionNumber: number;
  type: "MCQ" | "MSQ" | "NAT";
  marks: number;
  topic: string;
  difficulty: string;
  question: string;
  options: Option[];
  correctAnswer: string | string[] | number;
  hint: string;
  source: string;
};
type QuestionBank = {
  metadata: { totalQuestions: number };
  questions: ExamQuestion[];
};
type AnswerResult = { correct: boolean; answer: string };
type ExamDifficulty = "all" | "easy" | "medium" | "hard";

const timerChoices = [
  { value: 0, label: "Off" },
  { value: 600, label: "10 min" },
  { value: 1200, label: "20 min" },
  { value: 1800, label: "30 min" },
];
const difficultyChoices: { value: ExamDifficulty; label: string }[] = [
  { value: "all", label: "All difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function ExamPractice() {
  const [bank, setBank] = useState<QuestionBank | null>(null);
  const [loadError, setLoadError] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [customQuestionCount, setCustomQuestionCount] = useState("5");
  const [timerDuration, setTimerDuration] = useState(0);
  const [customTimerMinutes, setCustomTimerMinutes] = useState("");
  const [difficulty, setDifficulty] = useState<ExamDifficulty>("all");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, AnswerResult>>({});
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const [started, setStarted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const question = questions[index];
  const result = question ? results[question.id] : undefined;
  const score = Object.values(results).filter((item) => item.correct).length;
  const answeredCount = Object.keys(results).length;
  const complete = started && (timedOut || answeredCount === questions.length);
  const filteredQuestions = useMemo(
    () =>
      bank?.questions.filter(
        (item) => difficulty === "all" || item.difficulty === difficulty,
      ) ?? [],
    [bank, difficulty],
  );
  const countOptions = useMemo(
    () =>
      [5, 10, 15, filteredQuestions.length].filter(
        (count, position, values) =>
          count > 0 &&
          count <= filteredQuestions.length &&
          values.indexOf(count) === position,
      ),
    [filteredQuestions.length],
  );

  useEffect(() => {
    fetch("/questions.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Question bank could not be loaded.");
        return response.json() as Promise<QuestionBank>;
      })
      .then(setBank)
      .catch((error: unknown) =>
        setLoadError(
          error instanceof Error
            ? error.message
            : "Question bank could not be loaded.",
        ),
      );
  }, []);

  useEffect(() => {
    if (!started || timerDuration === 0 || timedOut || complete) return;
    const interval = window.setInterval(
      () =>
        setTimerRemaining((current) => {
          if (current <= 1) {
            setTimedOut(true);
            return 0;
          }
          return current - 1;
        }),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [started, timerDuration, timedOut, complete]);

  function startExam() {
    if (!bank) return;
    const safeQuestionCount = Math.max(
      1,
      Math.min(questionCount, filteredQuestions.length),
    );
    const shuffled = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, safeQuestionCount);
    setQuestions(shuffled);
    setIndex(0);
    setAnswer("");
    setSelectedOptions([]);
    setResults({});
    setTimerRemaining(timerDuration);
    setTimedOut(false);
    setStarted(true);
    setShowHint(false);
  }

  function restart() {
    setStarted(false);
    setQuestions([]);
    setIndex(0);
    setResults({});
    setAnswer("");
    setSelectedOptions([]);
    setTimerRemaining(0);
    setTimedOut(false);
    setShowHint(false);
  }

  function submitAnswer() {
    if (!question || result || submitting) return;
    const submitted =
      question.type === "MSQ"
        ? [...selectedOptions].sort().join(",")
        : answer.trim();
    if (!submitted) return;
    setSubmitting(true);
    const correct = isCorrect(question, answer, selectedOptions);
    setResults((current) => ({
      ...current,
      [question.id]: { correct, answer: submitted },
    }));
    setSubmitting(false);
  }

  function nextQuestion() {
    setIndex((current) => Math.min(current + 1, questions.length - 1));
    setAnswer("");
    setSelectedOptions([]);
    setShowHint(false);
  }
  function toggleOption(label: string) {
    setSelectedOptions((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <p className="eyebrow">Exam practice / GATE CSE bank</p>
        <h1 className="display mt-4 text-6xl font-black">
          Practice under exam conditions.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[var(--muted)]">
          A randomized gate question bank exam mode.
        </p>
        {loadError && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {loadError}
          </div>
        )}
        {!started ? (
          <Setup
            bank={bank}
            countOptions={countOptions}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            availableQuestionCount={filteredQuestions.length}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            customQuestionCount={customQuestionCount}
            setCustomQuestionCount={setCustomQuestionCount}
            timerDuration={timerDuration}
            setTimerDuration={setTimerDuration}
            customTimerMinutes={customTimerMinutes}
            setCustomTimerMinutes={setCustomTimerMinutes}
            onStart={startExam}
          />
        ) : complete ? (
          <>
            <QuizScorecard
              total={questions.length}
              score={score}
              answeredCount={answeredCount}
              difficulty={difficulty === "all" ? "Mixed GATE" : difficulty}
              timedOut={timedOut}
              onRestart={restart}
              title="Exam scorecard"
            />
            <ExamReview questions={questions} results={results} />
          </>
        ) : (
          <ExamCard
            question={question}
            index={index}
            total={questions.length}
            result={result}
            answer={answer}
            setAnswer={setAnswer}
            selectedOptions={selectedOptions}
            toggleOption={toggleOption}
            timerRemaining={timerRemaining}
            timerEnabled={timerDuration > 0}
            showHint={showHint}
            setShowHint={setShowHint}
            submitting={submitting}
            onSubmit={submitAnswer}
            onNext={nextQuestion}
            onRestart={restart}
          />
        )}
      </div>
    </SiteShell>
  );
}

function Setup({
  bank,
  countOptions,
  difficulty,
  setDifficulty,
  availableQuestionCount,
  questionCount,
  setQuestionCount,
  customQuestionCount,
  setCustomQuestionCount,
  timerDuration,
  setTimerDuration,
  customTimerMinutes,
  setCustomTimerMinutes,
  onStart,
}: {
  bank: QuestionBank | null;
  countOptions: number[];
  difficulty: ExamDifficulty;
  setDifficulty: (value: ExamDifficulty) => void;
  availableQuestionCount: number;
  questionCount: number;
  setQuestionCount: (value: number) => void;
  customQuestionCount: string;
  setCustomQuestionCount: (value: string) => void;
  timerDuration: number;
  setTimerDuration: (value: number) => void;
  customTimerMinutes: string;
  setCustomTimerMinutes: (value: string) => void;
  onStart: () => void;
}) {
  const maxQuestions = availableQuestionCount;
  function updateCustomCount(value: string) {
    setCustomQuestionCount(value);
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 1)
      setQuestionCount(Math.min(parsed, maxQuestions));
  }
  function updateCustomTimer(value: string) {
    setCustomTimerMinutes(value);
    const parsed = Number(value);
    if (value === "0") setTimerDuration(0);
    else if (Number.isInteger(parsed) && parsed >= 1)
      setTimerDuration(Math.min(parsed, 180) * 60);
  }
  return (
    <section className="panel mt-12 rounded-3xl p-7">
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
          <Settings2 size={21} />
        </div>
        <div>
          <h2 className="text-2xl font-black">Configure your paper</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {bank
              ? `${availableQuestionCount} questions match the selected difficulty.`
              : "Loading the supplied question bank..."}
          </p>
        </div>
      </div>
      <label className="field-label mt-8">Number of questions</label>
      <div className="flex flex-wrap gap-2">
        {countOptions.map((count) => (
          <button
            type="button"
            onClick={() => {
              setQuestionCount(count);
              setCustomQuestionCount(String(count));
            }}
            key={count}
            className={`rounded-xl border px-5 py-3 text-sm font-bold ${questionCount === count ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
          >
            {count === availableQuestionCount ? "Full filtered set" : count}
          </button>
        ))}
        <input
          type="number"
          min="1"
          max={maxQuestions}
          value={customQuestionCount}
          onChange={(event) => updateCustomCount(event.target.value)}
          className="field w-32"
          aria-label="Custom number of questions"
          placeholder="Custom"
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {maxQuestions
          ? `Choose any whole number from 1 to ${maxQuestions}.`
          : "No questions match this difficulty."}
      </p>
      <label className="field-label mt-8">Difficulty</label>
      <div className="grid gap-2 sm:grid-cols-4">
        {difficultyChoices.map((item) => (
          <button
            type="button"
            onClick={() => setDifficulty(item.value)}
            key={item.value}
            className={`rounded-xl border p-3 text-sm font-bold ${difficulty === item.value ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label className="field-label mt-8">Timer</label>
      <div className="grid gap-2 sm:grid-cols-4">
        {timerChoices.map((item) => (
          <button
            type="button"
            onClick={() => {
              setTimerDuration(item.value);
              setCustomTimerMinutes(item.value ? String(item.value / 60) : "0");
            }}
            key={item.value}
            className={`rounded-xl border p-3 text-sm font-bold ${timerDuration === item.value ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
          >
            {item.label}
          </button>
        ))}
        <input
          type="number"
          min="0"
          max="180"
          value={customTimerMinutes}
          onChange={(event) => updateCustomTimer(event.target.value)}
          className="field"
          aria-label="Custom timer in minutes"
          placeholder="Custom minutes"
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Enter 0 for no timer, or any whole number from 1 to 180 minutes.
      </p>
      <button
        type="button"
        disabled={!bank || availableQuestionCount === 0}
        onClick={onStart}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 font-extrabold text-white disabled:opacity-50"
      >
        {bank && availableQuestionCount > 0 ? (
          <>
            <Play size={17} /> Start randomized exam
          </>
        ) : (
          <>
            <LoaderCircle className="animate-spin" size={17} /> Loading question
            bank...
          </>
        )}
      </button>
    </section>
  );
}

function ExamCard({
  question,
  index,
  total,
  result,
  answer,
  setAnswer,
  selectedOptions,
  toggleOption,
  timerRemaining,
  timerEnabled,
  showHint,
  setShowHint,
  submitting,
  onSubmit,
  onNext,
  onRestart,
}: {
  question: ExamQuestion;
  index: number;
  total: number;
  result?: AnswerResult;
  answer: string;
  setAnswer: (value: string) => void;
  selectedOptions: string[];
  toggleOption: (label: string) => void;
  timerRemaining: number;
  timerEnabled: boolean;
  showHint: boolean;
  setShowHint: (value: boolean) => void;
  submitting: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const finished = Boolean(result) && index === total - 1;
  return (
    <section className="panel mt-12 rounded-3xl p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[var(--muted)]">
        <span>
          QUESTION {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
        <span className="rounded-full border px-3 py-1 uppercase">
          {question.exam} {question.year} · {question.type}
        </span>
        <QuizTimer seconds={timerRemaining} enabled={timerEnabled} />
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--line)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
      <div className="mt-8 flex items-start justify-between gap-4">
        <h2 className="max-w-2xl text-2xl font-black leading-tight">
          {question.question}
        </h2>
        <span className="hidden rounded-lg bg-[var(--ink)] px-2 py-1 font-mono text-[10px] text-[var(--background)] sm:inline">
          {question.topic}
        </span>
      </div>
      {question.type === "NAT" ? (
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={Boolean(result)}
          className="field mt-8"
          placeholder="Enter a numeric answer"
          inputMode="decimal"
        />
      ) : (
        <div className="mt-8 space-y-2">
          {question.options.map((option) => (
            <label
              key={option.label}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-semibold ${selectedOptions.includes(option.label) ? "border-[var(--accent)] bg-[var(--accent)]/10" : ""}`}
            >
              <input
                type={question.type === "MSQ" ? "checkbox" : "radio"}
                name={question.id}
                checked={selectedOptions.includes(option.label)}
                onChange={() =>
                  question.type === "MSQ"
                    ? toggleOption(option.label)
                    : (setAnswer(option.label), toggleOption(option.label))
                }
                disabled={Boolean(result)}
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <b className="mr-2 font-mono">{option.label}</b>
                {option.text}
              </span>
            </label>
          ))}
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="rounded-full border px-4 py-2 text-sm font-bold"
        >
          {showHint ? "Hide hint" : "Hint"}
        </button>
        {!result && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={
              submitting || (!answer.trim() && selectedOptions.length === 0)
            }
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              <Send size={15} />
            )}{" "}
            Submit answer
          </button>
        )}
        {result && !finished && (
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
            <RotateCcw size={15} /> New exam
          </button>
        )}
      </div>
      {showHint && (
        <div className="mt-4 rounded-2xl border border-[var(--accent-2)] bg-[var(--accent-2)]/10 p-4 text-sm">
          <b>Hint:</b> {question.hint}
        </div>
      )}
      {result && (
        <div
          className={`mt-6 flex gap-3 rounded-2xl p-4 text-sm ${result.correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
        >
          {result.correct ? <CheckCircle2 size={19} /> : <XCircle size={19} />}
          <div>
            <b>{result.correct ? "Correct." : "Incorrect."}</b>
            <p className="mt-1">Source: {question.source}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function isCorrect(
  question: ExamQuestion,
  answer: string,
  selectedOptions: string[],
) {
  if (question.type === "MSQ")
    return (
      Array.isArray(question.correctAnswer) &&
      [...question.correctAnswer].sort().join(",") ===
        [...selectedOptions].sort().join(",")
    );
  if (question.type === "NAT")
    return Number(answer) === Number(question.correctAnswer);
  return answer === question.correctAnswer;
}

function ExamReview({
  questions,
  results,
}: {
  questions: ExamQuestion[];
  results: Record<string, AnswerResult>;
}) {
  return (
    <section className="panel mt-6 rounded-3xl p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Post-exam review</p>
          <h2 className="mt-1 text-2xl font-black">
            Questions, answers, and hints
          </h2>
        </div>
        <span className="text-xs font-bold text-[var(--muted)]">
          {questions.length} reviewed
        </span>
      </div>
      <div className="mt-6 space-y-3">
        {questions.map((question, index) => {
          const result = results[question.id];
          return (
            <details className="rounded-2xl border p-5" key={question.id}>
              <summary className="cursor-pointer list-none">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm font-bold text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-6">{question.question}</p>
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      {question.source} · {question.type} ·{" "}
                      {result
                        ? result.correct
                          ? "Correct"
                          : "Incorrect"
                        : "Unanswered"}
                    </p>
                  </div>
                </div>
              </summary>
              <div className="mt-5 space-y-4 border-t pt-4 text-sm">
                <div>
                  <p className="field-label">Correct answer</p>
                  <p className="rounded-xl bg-green-100 p-3 font-semibold text-green-900">
                    {formatCorrectAnswer(question)}
                  </p>
                </div>
                {result && (
                  <div>
                    <p className="field-label">Your answer</p>
                    <p
                      className={`rounded-xl p-3 font-semibold ${result.correct ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
                    >
                      {result.answer}
                    </p>
                  </div>
                )}
                <div>
                  <p className="field-label">Hint</p>
                  <p className="rounded-xl border p-3 leading-6 text-[var(--muted)]">
                    {question.hint}
                  </p>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function formatCorrectAnswer(question: ExamQuestion) {
  if (question.type === "MSQ" && Array.isArray(question.correctAnswer)) {
    return question.correctAnswer.join(", ");
  }
  if (question.type === "MCQ" && typeof question.correctAnswer === "string") {
    const option = question.options.find(
      (item) => item.label === question.correctAnswer,
    );
    return option ? `${option.label}. ${option.text}` : question.correctAnswer;
  }
  return String(question.correctAnswer);
}
