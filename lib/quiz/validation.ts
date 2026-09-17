import type {
  GeneratedQuizQuestion,
  QuizDifficulty,
  QuizTopic,
} from "@/types/quiz";

export const MAX_QUESTION_COUNT = 20;
const difficulties: QuizDifficulty[] = ["easy", "medium", "hard"];
const topics: QuizTopic[] = [
  "closure",
  "candidate-key",
  "canonical-cover",
  "general",
];

export function isDifficulty(value: unknown): value is QuizDifficulty {
  return (
    typeof value === "string" && difficulties.includes(value as QuizDifficulty)
  );
}

export function validateQuizRequest(value: unknown): {
  questionCount: number;
  difficulty: QuizDifficulty;
} {
  if (!value || typeof value !== "object")
    throw new Error("Request body must be an object.");
  const body = value as Record<string, unknown>;
  if (
    !Number.isInteger(body.questionCount) ||
    Number(body.questionCount) < 1 ||
    Number(body.questionCount) > MAX_QUESTION_COUNT
  ) {
    throw new Error(
      `Question count must be an integer from 1 to ${MAX_QUESTION_COUNT}.`,
    );
  }
  if (!isDifficulty(body.difficulty))
    throw new Error("Difficulty must be easy, medium, or hard.");
  return {
    questionCount: body.questionCount as number,
    difficulty: body.difficulty,
  };
}

export function validateGeneratedQuestions(
  value: unknown,
  expectedCount: number,
): GeneratedQuizQuestion[] {
  if (!Array.isArray(value) || value.length !== expectedCount)
    throw new Error("Gemini returned an invalid question set.");
  return value.map((item) => {
    if (!item || typeof item !== "object")
      throw new Error("Gemini returned an invalid question.");
    const question = item as Record<string, unknown>;
    const prompt = asText(question.prompt);
    const answer = asText(question.answer);
    const explanation = asText(question.explanation);
    const hint = asText(question.hint);
    const topic = topics.includes(question.topic as QuizTopic)
      ? (question.topic as QuizTopic)
      : "general";
    const options =
      question.options === undefined
        ? undefined
        : validateOptions(question.options);
    return {
      prompt,
      answer,
      explanation,
      hint,
      topic,
      ...(options ? { options } : {}),
    };
  });
}

function asText(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.length > 2000)
    throw new Error("Gemini returned an incomplete question.");
  return value.trim();
}

function validateOptions(value: unknown): string[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 6)
    throw new Error("Gemini returned invalid answer options.");
  const options = value.map(asText);
  if (
    new Set(options.map((option) => option.toLowerCase())).size !==
    options.length
  )
    throw new Error("Gemini returned duplicate answer options.");
  return options;
}
