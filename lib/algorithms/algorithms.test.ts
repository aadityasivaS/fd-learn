import { describe, expect, it } from "vitest";
import { calculateClosure } from "@/lib/algorithms/closure";
import { findCandidateKeys } from "@/lib/algorithms/candidate-keys";
import { findCanonicalCover } from "@/lib/algorithms/canonical-cover";
import { parseFunctionalDependencies } from "@/lib/parser/fd-parser";

describe("FDLab algorithms", () => {
  it("calculates a transitive closure", () => {
    const result = calculateClosure(
      ["A"],
      parseFunctionalDependencies("A -> B\nB -> C\nC -> D"),
    );
    expect(result.closure).toEqual(["A", "B", "C", "D"]);
  });

  it("finds a simple candidate key", () => {
    const result = findCandidateKeys(
      ["A", "B", "C"],
      parseFunctionalDependencies("A -> B\nB -> C"),
    );
    expect(result.keys).toEqual([["A"]]);
  });

  it("finds multiple candidate keys", () => {
    const result = findCandidateKeys(
      ["A", "B", "C"],
      parseFunctionalDependencies("A -> B\nB -> A\nA -> C"),
    );
    expect(result.keys).toContainEqual(["A"]);
    expect(result.keys).toContainEqual(["B"]);
  });

  it("decomposes RHS attributes and removes redundant FDs", () => {
    const result = findCanonicalCover(
      parseFunctionalDependencies("A -> BC\nB -> C\nA -> C"),
    );
    expect(
      result.stages[0].dependencies.map(
        (fd) => `${fd.lhs.join("")}->${fd.rhs.join("")}`,
      ),
    ).toEqual(["A->B", "A->C", "B->C", "A->C"]);
    expect(
      result.cover.map((fd) => `${fd.lhs.join("")}->${fd.rhs.join("")}`),
    ).toEqual(["A->B", "B->C"]);
  });

  it("rejects malformed and empty dependencies", () => {
    expect(() => parseFunctionalDependencies("A ->")).toThrow(
      "Right-hand side cannot be empty",
    );
    expect(() => parseFunctionalDependencies("-> B")).toThrow("Missing LHS");
  });
});
