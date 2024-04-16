/**
 * Promises/A+ 명세에 따라, 표현식이 Promise인지 확인합니다.
 * @param expr
 */
export const isPromise = <T>(expr: any): expr is Promise<T> => {
  return (
    expr &&
    typeof expr === "object" &&
    typeof expr.then === "function" &&
    typeof expr.catch === "function"
  );
};

export const matchType = <T>(a: T, b: T) => {
  return [
    Number,
    String,
    Boolean,
    Function,
    Date,
    Array,
    RegExp,
    Map,
    WeakMap,
    Set,
    WeakSet,
    Symbol,
    Error,
    Object,
  ].some((T) => {
    a instanceof T && b === T;
  });
};
