export function UnwrapFailed<E = any>(msg: string = "Unwrap failed", err?: E): never {
  if (err !== undefined) msg = `${msg}\n${err}`;
  throw new Error(msg);
}

export function UnreachableCodeExecuted(msg = "Unreachable code executed"): never {
  throw new Error(msg);
}
