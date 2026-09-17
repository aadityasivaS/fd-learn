import type { FunctionalDependency } from "@/types/functional-dependency";

export function normalizeAttributes(value: string): string[] {
  return [
    ...new Set(
      value
        .replace(/[{},\\s]/g, "")
        .split("")
        .filter(Boolean),
    ),
  ];
}

export function formatAttributes(attributes: string[]): string {
  return attributes.length ? attributes.join(", ") : "∅";
}

export function formatFd(fd: FunctionalDependency): string {
  return `${fd.lhs.join("")} → ${fd.rhs.join("")}`;
}

export function parseFunctionalDependencies(
  input: string,
): FunctionalDependency[] {
  return input
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/->|→/).map((part) => part.trim());
      if (parts.length !== 2) {
        throw new Error(
          `Invalid functional dependency: expected format A -> B.`,
        );
      }
      if (!parts[0]) throw new Error("Missing LHS in functional dependency.");
      if (!parts[1]) throw new Error("Right-hand side cannot be empty.");
      const lhs = normalizeAttributes(parts[0]);
      const rhs = normalizeAttributes(parts[1]);
      if (!lhs.length) throw new Error("Missing LHS in functional dependency.");
      if (!rhs.length) throw new Error("Right-hand side cannot be empty.");
      if (
        lhs.length !== parts[0].replace(/[{},\s]/g, "").length ||
        rhs.length !== parts[1].replace(/[{},\s]/g, "").length
      ) {
        throw new Error("Duplicate attributes detected.");
      }
      return { lhs, rhs };
    });
}
