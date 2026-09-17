export type QuizDifficulty = "easy" | "medium" | "hard";
export type QuizTopic =
  | "closure"
  | "candidate-key"
  | "canonical-cover"
  | "general";

export type QuizQuestion = {
  id: string;
  prompt: string;
  options?: string[];
  topic: QuizTopic;
  hint: string;
  gradingToken: string;
};

export type GenerateQuizRequest = {
  questionCount: number;
  difficulty: QuizDifficulty;
};

export type GenerateQuizResponse = {
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
};

export type GradeQuizRequest = {
  gradingToken: string;
  answer: string;
};

export type GradeQuizResponse = {
  correct: boolean;
  explanation: string;
};

export type GeneratedQuizQuestion = {
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
  hint: string;
  topic: QuizTopic;
};
