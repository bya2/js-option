import _isEqual from "lodash.isequal";
import { None, OptionSome, Some } from "./Option";
import { ResultOk, ResultErr, Ok, Err } from "./Result";
import { UnreachableCodeExecuted } from "./error";

export const nope = () => {};

const getTag = (sth: any): string => {
  return Object.prototype.toString.call(sth).slice(8, -1);
};

const isEqual = <T = any>(a: T, b: T, deep: boolean): boolean => {
  if (deep) {
    return _isEqual(a, b);
  } else {
    return a === b;
  }
};

export const compare = <T = any>(a: T, b: T, deep: boolean = false): boolean => {
  if ((a instanceof OptionSome && b instanceof OptionSome) || (a instanceof ResultOk && b instanceof ResultOk)) {
    return compare(a.unwrap(), b.unwrap(), deep);
  }

  if (a instanceof ResultErr && b instanceof ResultErr) {
    return compare(a.unwrapErr(), b.unwrapErr, deep);
  }

  return isEqual(a, b, deep);
};

const matchObject = <T extends { [key: string]: any } = any>(value: T, matcher: T, deep: boolean): boolean => {
  return Object.keys(matcher).every(p => isMatch(value[p], matcher[p], deep));
};

const isMatch = <T>(a: T, b: T, deep: boolean): boolean => {
  // 두 값이 모두 Result, Option일 때 내부 값으로 재귀
  if ((a instanceof ResultOk && b instanceof ResultOk) || (a instanceof OptionSome && b instanceof OptionSome)) {
    return isMatch(a.unwrap(), b.unwrap(), deep);
  }

  if (a instanceof ResultErr && b instanceof ResultErr) {
    return isMatch(a.unwrapErr(), b.unwrapErr(), deep);
  }

  // Result, Option 타입 매칭
  if ((a instanceof ResultOk && b === Ok) || (a instanceof ResultErr && b === Err) || (a instanceof OptionSome && b === Some)) {
    return true;
  }

  if (a === None) {
    return b === None;
  }

  // 값 비교
  if (isEqual(a, b, deep)) {
    return true;
  }

  // 자바스크립트 타입 매칭
  if (
    [Number, String, Boolean, Function, Date, Array, RegExp, Map, WeakMap, Set, WeakSet, Symbol, Error, Object].some(E => a instanceof E && b === E)
  ) {
    return true;
  }

  // 문자열 타입일 때 포함 관계
  if (a instanceof String && typeof b === "string") {
    return a.includes(b);
  }

  // 날짜 타입일 때 값 비교
  if (a instanceof Date && b instanceof Date && a.valueOf() === b.valueOf()) {
    return true;
  }

  if (a instanceof Object) {
    if (b instanceof Function) {
      return a instanceof b;
    }

    if (b instanceof Object) {
      return matchObject(a, b, deep);
    }
  }

  return false;
};

export const match = <T = any, U = any>(
  scrutinee: T,
  patterns: IterableIterator<(() => U) | [any, U | ((x?: any) => U)]>,
  deep: boolean = false,
): U => {
  for (const arm of patterns) {
    if (arm instanceof Function) return arm();

    if (arm instanceof Array) {
      const [b0, b1] = arm;
      if (isMatch(scrutinee, b0, deep)) {
        if (b1 instanceof Function) {
          if (scrutinee instanceof ResultOk || scrutinee instanceof OptionSome) return b1(scrutinee.unwrap());
          if (scrutinee instanceof ResultErr) return b1(scrutinee.unwrapErr());
        } else {
          return b1;
        }
      }
    }
  }

  UnreachableCodeExecuted();
};
