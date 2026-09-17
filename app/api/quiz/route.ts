import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createGradingToken } from "@/lib/quiz/grading";
import { generateQuizQuestions } from "@/lib/quiz/gemini";
import { validateQuizRequest } from "@/lib/quiz/validation";
import type { GenerateQuizResponse } from "@/types/quiz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = validateQuizRequest(await request.json());
    const secret = process.env.QUIZ_SIGNING_SECRET;
    if (!process.env.GEMINI_API_KEY || !secret) {
      return NextResponse.json(
        { error: "Quiz generation is not configured on this server." },
        { status: 503 },
      );
    }
    const generated = await generateQuizQuestions(
      input.questionCount,
      input.difficulty,
    );
    const response: GenerateQuizResponse = {
      difficulty: input.difficulty,
      questions: generated.map((question) => ({
        id: randomUUID(),
        prompt: question.prompt,
        ...(question.options ? { options: question.options } : {}),
        topic: question.topic,
        hint: question.hint,
        gradingToken: createGradingToken(
          question.answer,
          question.explanation,
          secret,
        ),
      })),
    };
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    const message =
      error instanceof Error ? error.message : "Quiz generation failed.";
    const status =
      message.includes("must") ||
      message.includes("Difficulty") ||
      message.includes("Question count")
        ? 400
        : 502;
    return NextResponse.json(
      {
        error:
          status === 400
            ? message
            : "Quiz generation failed. Check your Gemini configuration and try again.",
      },
      { status },
    );
  }
}
