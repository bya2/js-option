export function unwrapFailed<E>(msg: string, error?: E): never {
  if (error instanceof Error) {
    error.message = msg;
    throw error;
  }

  const err = new Error(msg);
  error !== undefined && Object.defineProperty(err, "data", { value: error });
  throw err;
}

//UnreachableCodeExecuted
export function unreachableUnchecked(): never {
  console.assert(false, "`unreachableUnchecked()` must never be reached");
  throw new Error("Unreachable code reached");
}

export function expectFailed(msg: string): never {
  throw new Error(msg);
}
