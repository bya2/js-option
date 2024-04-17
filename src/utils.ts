/**
 * Promises/A+ 명세에 따라, 표현식이 Promise인지 확인합니다.
 * @param expr
 */
export function isPromise<T>(expr: any): expr is Promise<T> {
  return (
    expr &&
    typeof expr === "object" &&
    typeof expr.then === "function" &&
    typeof expr.catch === "function"
  );
}
