import _isEqual from "lodash.isequal";
import { TSome } from "@repo/option";
import { TOk, TErr } from "@repo/result";

/**
 * [`Option`] 혹은 [`Result`]인 `a`와 `b` 값이 동등한 지 비교합니다.
 * @param a
 * @param b
 */
export function isEqual(a: any, b: any): boolean {
  if (
    (a instanceof TOk && b instanceof TOk) ||
    (a instanceof TSome && b instanceof TSome)
  ) {
    isEqual(a.unwrap(), b.unwrap());
  }

  if (a instanceof TErr && b instanceof TErr) {
    isEqual(a.unwrapErr(), b.unwrapErr());
  }

  return a === b || _isEqual(a, b);
}
