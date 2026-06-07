export class UnreachableCaseError extends Error {
  override name = 'UnreachableCaseError';
  constructor(val: never) {
    super(`Unreachable case: ${JSON.stringify(val)}`);
  }
}
