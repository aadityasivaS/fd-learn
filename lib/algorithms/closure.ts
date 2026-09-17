import type {
  ClosureResult,
  ClosureStep,
  FunctionalDependency,
} from "@/types/functional-dependency";
import { formatFd } from "@/lib/parser/fd-parser";

export function calculateClosure(
  attributes: string[],
  dependencies: FunctionalDependency[],
): ClosureResult {
  const closure = [...new Set(attributes)].sort();
  const steps: ClosureStep[] = [
    {
      before: [...closure],
      fdApplied: null,
      addedAttributes: [],
      after: [...closure],
    },
  ];
  let changed = true;
  while (changed) {
    changed = false;
    for (const fd of dependencies) {
      if (fd.lhs.every((attribute) => closure.includes(attribute))) {
        const addedAttributes = fd.rhs.filter(
          (attribute) => !closure.includes(attribute),
        );
        if (addedAttributes.length) {
          const before = [...closure];
          closure.push(...addedAttributes);
          closure.sort();
          steps.push({
            before,
            fdApplied: formatFd(fd),
            addedAttributes,
            after: [...closure],
          });
          changed = true;
        }
      }
    }
  }
  return { closure, steps };
}

export function implies(
  fdSet: FunctionalDependency[],
  target: FunctionalDependency,
): boolean {
  const result = calculateClosure(target.lhs, fdSet).closure;
  return target.rhs.every((attribute) => result.includes(attribute));
}
