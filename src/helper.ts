import { SomeType } from "./Option";
import _isequal from "lodash.isequal";

const isEqual = <T>(a: T, b: T, deep: boolean): boolean => {
  return a === b || (deep && _isequal(a, b));
};

export const compare = <T>(a: T, b: T, deep: boolean): boolean => {
  return a instanceof SomeType && b instanceof SomeType ? compare(a.unwrap(), b.unwrap(), deep) : isEqual(a, b, deep);
};
