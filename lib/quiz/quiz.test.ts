import { describe, expect, it } from "vitest";
import {
  createGradingToken,
  normalizeAnswer,
  readGradingToken,
} from "@/lib/quiz/grading";
import {
  validateGeneratedQuestions,
  validateQuizRequest,
} from "@/lib/quiz/validation";

describe("quiz validation", () => {
  it("accepts a bounded question request", () => {
    expect(
      validateQuizRequest({ questionCount: 5, difficulty: "medium" }),
    ).toEqual({ questionCount: 5, difficulty: "medium" });
  });

  it("rejects unsupported count and difficulty", () => {
    expect(() =>
      validateQuizRequest({ questionCount: 21, difficulty: "easy" }),
    ).toThrow("1 to 20");
    expect(() =>
      validateQuizRequest({ questionCount: 3, difficulty: "expert" }),
    ).toThrow("easy, medium, or hard");
  });

  it("validates generated questions", () => {
    expect(
      validateGeneratedQuestions(
        [
          {
            prompt: "What is A+?",
            answer: "ABC",
            explanation: "Apply A -> B, then B -> C.",
            hint: "Start with A.",
            topic: "closure",
            options: ["ABC", "A"],
          },
        ],
        1,
      )[0].topic,
    ).toBe("closure");
    expect(() =>
      validateGeneratedQuestions([{ prompt: "Missing answer" }], 1),
    ).toThrow("incomplete question");
  });
});

describe("encrypted grading tokens", () => {
  it("round-trips grading data without exposing plaintext in the token", () => {
    const token = createGradingToken(
      "ABC",
      "The closure contains all three attributes.",
      "test-secret",
    );
    expect(token).not.toContain("ABC");
    expect(readGradingToken(token, "test-secret").answer).toBe("ABC");
    expect(() => readGradingToken(token, "wrong-secret")).toThrow(
      "Invalid or expired",
    );
  });

  it("normalizes closure-style answers", () => {
    expect(normalizeAnswer("{ A, B, C }")).toBe("ABC");
  });
});
