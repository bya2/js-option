import isEqual from "lodash.isequal";
import { TSome } from "@/Option";
import { TOk, TErr } from "@/Result";
import { throwUnreachableUnchecked } from "./error";

type TMatchArmFn<T, U> = (x: T) => U;

type TMatchArm<T, U> = TMatchArmFn<T, U> | [any, U | TMatchArmFn<T, U>];

export const match = <T, U>(expr: T, arms: TMatchArm<T, U>[]): U => {
  for (const arm of arms) {
    if (arm instanceof Function) {
      return arm(
        expr instanceof TOk || expr instanceof TSome
          ? expr.unwrap()
          : expr instanceof TErr
            ? expr.unwrapErr()
            : expr
      );
    }

    if (Array.isArray(arm) && equal(expr, arm[0])) {
      return arm[1] instanceof Function ? arm[1](expr) : arm[1];
    }
  }

  throwUnreachableUnchecked();
};

export const equal = <T>(a: T, b: T): boolean => {
  if (
    (a instanceof TOk && b instanceof TOk) ||
    (a instanceof TSome && b instanceof TSome)
  ) {
    equal(a.unwrap(), b.unwrap());
  }

  if (a instanceof TErr && b instanceof TErr) {
    equal(a.unwrapErr(), b.unwrapErr());
  }

  return a === b || isEqual(a, b);
};
