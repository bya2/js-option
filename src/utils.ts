import _isEqual from "lodash.isequal";
import { OptionSome, OptionNone, Some, None, Option } from "./Option";
import { ResultOk, ResultErr, Ok, Err, Result } from "./Result";
import { UnreachableCodeExecuted } from "./error";

export const nope = () => {};

/**
 * Util
 * @param sth
 * @returns
 */
const getTag = (sth: any): string => {
  return Object.prototype.toString.call(sth).slice(8, -1);
};

/**
 * Util
 * @param a
 * @param b
 * @param deep
 * @returns
 */
const isEqual = <T = any>(a: T, b: T, deep: boolean): boolean => {
  if (deep) {
    return _isEqual(a, b);
  } else {
    return a === b;
  }
};

/**
 * Helper
 * @param a
 * @param b
 * @param deep
 * @returns
 */
export const compare = <T = any>(a: T, b: T, deep: boolean = false): boolean => {
  if ((a instanceof OptionSome && b instanceof OptionSome) || (a instanceof ResultOk && b instanceof ResultOk)) {
    return compare(a.unwrap(), b.unwrap(), deep);
  }

  if (a instanceof ResultErr && b instanceof ResultErr) {
    return compare(a.unwrapErr(), b.unwrapErr, deep);
  }

  return isEqual(a, b, deep);
};

const matchJsType = <T>(a: T, b: T) => {
  return [Number, String, Boolean, Function, Date, Array, RegExp, Map, WeakMap, Set, WeakSet, Symbol, Error, Object].some(
    E => a instanceof E && b === E,
  );
};

const matchObject = <T extends { [key: string]: any } = any>(objA: T, matcher: T, deep: boolean): boolean => {
  return Object.keys(matcher).every(p => isMatch(objA[p], matcher[p], deep));
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
  if (matchJsType(a, b)) {
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

const armMap = <T>(x: T, cb: Function) => {
  if (x instanceof ResultOk || x instanceof OptionSome) return cb(x.unwrap());
  if (x instanceof ResultErr) return cb(x.unwrapErr());
};

/**
 * Helper
 * @param scrutinee
 * @param matchArms
 * @param deep
 * @returns
 */
export const match = <T = any, U = any>(
  scrutinee: T,
  matchArms: IterableIterator<((x?: T) => U) | [any, U | ((x?: any) => U)]>,
  deep: boolean = false,
): U => {
  for (const arm of matchArms) {
    if (arm instanceof Function) {
      if (scrutinee instanceof ResultOk || scrutinee instanceof OptionSome) return arm(scrutinee.unwrap());
      if (scrutinee instanceof ResultErr) return arm(scrutinee.unwrapErr());
      return arm(scrutinee);
    }

    if (arm instanceof Array) {
      const [arm0, arm1] = arm;
      if (isMatch(scrutinee, arm0, deep)) {
        if (arm1 instanceof Function) {
          if (scrutinee instanceof ResultOk || scrutinee instanceof OptionSome) return arm1(scrutinee.unwrap());
          if (scrutinee instanceof ResultErr) return arm1(scrutinee.unwrapErr());
        } else {
          return arm1;
        }
      }
    }
  }

  UnreachableCodeExecuted();
};
