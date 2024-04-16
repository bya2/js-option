/**
 * `expect` 함수나 메서드가 실패했음을 알리는 에러를 발생시킵니다.
 * @param msg
 */
export function throwExpectFailed(msg?: string): never {
  throw new Error(`Expect failed: ${msg || ""}`);
}

/**
 * `unwrap` 함수나 메서드가 실패했음을 알리는 에러를 발생시킵니다.
 * @param msg
 * @param error
 */
export function throwUnwrapFailed<E>(msg?: string, error?: E): never {
  msg = `Unwrap failed: ${msg || ""}`.trim();

  if (error instanceof Error) {
    error.message = msg;
    throw error;
  }

  const err = new Error(msg);
  error !== undefined && Object.defineProperty(err, "data", { value: error });
  throw err;
}

/**
 * 컨텍스트가 현재 도달할 수 없는 지점임을 알리는 에러를 발생시킵니다.
 * @param msg
 */
export function throwUnreachableUnchecked(msg?: string): never {
  throw new Error(
    `Unreachable code reached: ${msg || "`unreachableUnchecked()` must never be reached"}`
  );
}
