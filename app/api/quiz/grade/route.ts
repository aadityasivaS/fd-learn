import { NextResponse } from "next/server";
import { normalizeAnswer, readGradingToken } from "@/lib/quiz/grading";
import type { GradeQuizResponse } from "@/types/quiz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      typeof body.gradingToken !== "string" ||
      typeof body.answer !== "string"
    ) {
      return NextResponse.json(
        { error: "A grading token and answer are required." },
        { status: 400 },
      );
    }
    const secret = process.env.QUIZ_SIGNING_SECRET;
    if (!secret)
      return NextResponse.json(
        { error: "Quiz grading is not configured on this server." },
        { status: 503 },
      );
    const payload = readGradingToken(body.gradingToken, secret);
    const result: GradeQuizResponse = {
      correct: normalizeAnswer(body.answer) === normalizeAnswer(payload.answer),
      explanation: payload.explanation,
    };
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 },
      );
    return NextResponse.json(
      {
        error:
          "This quiz answer can no longer be graded. Generate a new quiz and try again.",
      },
      { status: 400 },
    );
  }
}
