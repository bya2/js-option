import { OptionSome } from "./Option";
import { ResultOk, ResultErr } from "./Result";
import _isEqual from "lodash.isequal";

const isEqual = <T = any>(a: T, b: T, deep: boolean): boolean => {
  if (deep) {
    return _isEqual(a, b);
  } else {
    return a === b;
  }
};

const compare = <T = any>(a: T, b: T, deep: boolean): boolean => {
  if ((a instanceof OptionSome && b instanceof OptionSome) || (a instanceof ResultOk && b instanceof ResultOk)) {
    return compare(a.unwrap(), b.unwrap(), deep);
  }

  if (a instanceof ResultErr && b instanceof ResultErr) {
    return compare(a.unwrapErr(), b.unwrapErr, deep);
  }

  return isEqual(a, b, deep);
};
