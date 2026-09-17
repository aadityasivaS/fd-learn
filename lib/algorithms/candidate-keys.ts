import type { FunctionalDependency } from "@/types/functional-dependency";
import { calculateClosure } from "@/lib/algorithms/closure";

export type KeyReasoning = {
  key: string[];
  closure: string[];
  minimality: { attribute: string; closure: string[]; removable: boolean }[];
};
export type CandidateKeyResult = {
  keys: string[][];
  reasoning: KeyReasoning[];
  explored: { set: string[]; closure: string[]; superkey: boolean }[];
};

export function findCandidateKeys(
  relation: string[],
  dependencies: FunctionalDependency[],
): CandidateKeyResult {
  const universe = [...new Set(relation)].sort();
  const rhs = new Set(dependencies.flatMap((fd) => fd.rhs));
  const seed = universe.filter((attribute) => !rhs.has(attribute));
  const explored: CandidateKeyResult["explored"] = [];
  const keys: string[][] = [];
  const queue: string[][] = [seed];
  while (queue.length) {
    const current = queue.shift()!;
    if (
      keys.some((key) => key.every((attribute) => current.includes(attribute)))
    )
      continue;
    const closure = calculateClosure(current, dependencies).closure;
    const superkey = universe.every((attribute) => closure.includes(attribute));
    explored.push({ set: current, closure, superkey });
    if (superkey) {
      if (
        !keys.some(
          (key) =>
            key.length === current.length &&
            key.every((attribute) => current.includes(attribute)),
        )
      )
        keys.push(current);
      continue;
    }
    for (const attribute of universe.filter(
      (item) => !current.includes(item),
    )) {
      const next = [...current, attribute].sort();
      if (!queue.some((item) => item.join("") === next.join("")))
        queue.push(next);
    }
  }
  const reasoning = keys.map((key) => ({
    key,
    closure: calculateClosure(key, dependencies).closure,
    minimality: key.map((attribute) => {
      const reduced = key.filter((item) => item !== attribute);
      const reducedClosure = calculateClosure(reduced, dependencies).closure;
      return {
        attribute,
        closure: reducedClosure,
        removable: universe.every((item) => reducedClosure.includes(item)),
      };
    }),
  }));
  return { keys, reasoning, explored };
}
