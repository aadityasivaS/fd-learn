export type FunctionalDependency = {
  lhs: string[];
  rhs: string[];
};

export type ClosureStep = {
  before: string[];
  fdApplied: string | null;
  addedAttributes: string[];
  after: string[];
};

export type ClosureResult = {
  closure: string[];
  steps: ClosureStep[];
};
