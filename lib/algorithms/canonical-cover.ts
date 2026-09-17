import type { FunctionalDependency } from "@/types/functional-dependency";
import { calculateClosure, implies } from "@/lib/algorithms/closure";
import { formatFd } from "@/lib/parser/fd-parser";

export type CanonicalStage = {
  title: string;
  description: string;
  dependencies: FunctionalDependency[];
  details: string[];
};
export type CanonicalCoverResult = {
  stages: CanonicalStage[];
  cover: FunctionalDependency[];
};

export function findCanonicalCover(
  input: FunctionalDependency[],
): CanonicalCoverResult {
  const current = input.flatMap((fd) =>
    fd.rhs.map((attribute) => ({ lhs: [...fd.lhs], rhs: [attribute] })),
  );
  const stages: CanonicalStage[] = [
    {
      title: "RHS decomposition",
      description:
        "Split every dependency with multiple attributes on the right.",
      dependencies: clone(current),
      details: ["Each FD now has exactly one RHS attribute."],
    },
  ];
  const lhsDetails: string[] = [];
  for (let index = 0; index < current.length; index++) {
    const fd = current[index];
    for (const attribute of [...fd.lhs]) {
      if (fd.lhs.length === 1) continue;
      const reduced: FunctionalDependency = {
        lhs: fd.lhs.filter((item) => item !== attribute),
        rhs: fd.rhs,
      };
      const without = current.map((item, itemIndex) =>
        itemIndex === index ? reduced : item,
      );
      const derived = calculateClosure(reduced.lhs, without).closure.includes(
        fd.rhs[0],
      );
      lhsDetails.push(
        `${attribute} in ${formatFd(fd)}: ${derived ? "extraneous, removed" : "necessary, kept"}.`,
      );
      if (derived) fd.lhs = reduced.lhs;
    }
  }
  stages.push({
    title: "Extraneous LHS attributes",
    description:
      "Test each left-side attribute by recalculating closure without it.",
    dependencies: clone(current),
    details: lhsDetails,
  });
  const redundantDetails: string[] = [];
  for (let index = current.length - 1; index >= 0; index--) {
    const fd = current[index];
    const remaining = current.filter((_, itemIndex) => itemIndex !== index);
    const redundant = implies(remaining, fd);
    redundantDetails.push(
      `${formatFd(fd)}: ${redundant ? "implied by the remaining set, removed" : "still needed"}.`,
    );
    if (redundant) current.splice(index, 1);
  }
  stages.push({
    title: "Redundant FD removal",
    description:
      "Temporarily remove each FD and test whether it is still implied.",
    dependencies: clone(current),
    details: redundantDetails,
  });
  return { stages, cover: current };
}

function clone(dependencies: FunctionalDependency[]): FunctionalDependency[] {
  return dependencies.map((fd) => ({ lhs: [...fd.lhs], rhs: [...fd.rhs] }));
}
