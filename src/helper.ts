import { SomeType } from "./Option";
import { OkType, ErrType } from "@bya2/js-result";
import _isequal from "lodash.isequal";

const isEqual = <T>(a: T, b: T, deep: boolean): boolean => {
  return a === b || (deep && _isequal(a, b));
};

export const compare = <T>(a: T, b: T, deep: boolean): boolean => {
  if ((a instanceof OkType && b instanceof OkType) || (a instanceof SomeType && b instanceof SomeType)) return compare(a.unwrap(), b.unwrap(), deep);
  if (a instanceof ErrType && b instanceof ErrType) return compare(a.unwrapErr(), b.unwrapErr(), deep);
  return isEqual(a, b, deep);
};
