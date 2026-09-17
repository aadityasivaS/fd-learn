import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const VERSION = "v1";
const MAX_TOKEN_AGE_MS = 30 * 60 * 1000;

type GradingPayload = {
  answer: string;
  explanation: string;
  createdAt: number;
};

function keyFromSecret(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export function createGradingToken(
  answer: string,
  explanation: string,
  secret: string,
): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  const payload: GradingPayload = {
    answer,
    explanation,
    createdAt: Date.now(),
  };
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv, tag, encrypted]
    .map((part) => part.toString("base64url"))
    .join(".");
}

export function readGradingToken(
  token: string,
  secret: string,
): GradingPayload {
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== VERSION)
    throw new Error("Invalid grading token.");
  try {
    const iv = Buffer.from(parts[1], "base64url");
    const tag = Buffer.from(parts[2], "base64url");
    const encrypted = Buffer.from(parts[3], "base64url");
    const decipher = createDecipheriv("aes-256-gcm", keyFromSecret(secret), iv);
    decipher.setAuthTag(tag);
    const payload = JSON.parse(
      Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
        "utf8",
      ),
    ) as GradingPayload;
    if (
      !payload.answer ||
      !payload.explanation ||
      Date.now() - payload.createdAt > MAX_TOKEN_AGE_MS ||
      payload.createdAt > Date.now() + 60_000
    )
      throw new Error("Expired grading token.");
    return payload;
  } catch {
    throw new Error("Invalid or expired grading token.");
  }
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/[{}\s,]/g, "")
    .toUpperCase();
}
