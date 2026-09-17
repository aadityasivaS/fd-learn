import { GoogleGenAI } from "@google/genai";
import type { GeneratedQuizQuestion, QuizDifficulty } from "@/types/quiz";
import { validateGeneratedQuestions } from "@/lib/quiz/validation";

const MODEL = "gemini-3.5-flash-lite";

export async function generateQuizQuestions(
  questionCount: number,
  difficulty: QuizDifficulty,
): Promise<GeneratedQuizQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini is not configured.");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Create exactly ${questionCount} educational functional-dependency quiz questions at ${difficulty} difficulty. Cover attribute closure, candidate keys, and canonical covers. Questions must be solvable from the prompt. Return only a JSON array. Each item must have prompt, answer, explanation, hint, topic, and optionally options. Use topic values closure, candidate-key, canonical-cover, or general. If options are present, answer must exactly match one option. Do not include markdown.`,
    config: { responseMimeType: "application/json", temperature: 0.4 },
  });
  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }
  return validateGeneratedQuestions(parsed, questionCount);
}
