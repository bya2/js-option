import { Option, SOME, NONE, Some, None } from "./Option";
import { Ok, Err } from "./Result";

const nope = () => {};
const returnT = () => true;
const returnF = () => false;
const inc = (n: number) => ++n;
const add = (a: any, b: any) => a + b;

type T = readonly [
  "isSome",
  "isSomeAnd",
  "isNone",
  "expect",
  "unwrap",
  "unwrapOr",
  "unwrapOrElse",
  "unwrapUnchecked",
  "map",
  "inspect",
  "mapOr",
  "mapOrElse",
  "okOr",
  "okOrElse",
  "and",
  "andThen",
  "filter",
  "or",
  "orElse",
  "xor",
  "zip",
  "zipWith",
  "transpose",
];

const m: T = [
  "isSome",
  "isSomeAnd",
  "isNone",
  "expect",
  "unwrap",
  "unwrapOr",
  "unwrapOrElse",
  "unwrapUnchecked",
  "map",
  "inspect",
  "mapOr",
  "mapOrElse",
  "okOr",
  "okOrElse",
  "and",
  "andThen",
  "filter",
  "or",
  "orElse",
  "xor",
  "zip",
  "zipWith",
  "transpose",
];

const a = m[0];

describe(".isSome", () => {
  const method = m[0];
  test("Some: `true`를 반환", () => {
    expect(Some(1)[method]()).toBe(true);
  });

  test("None: `false`를 반환", () => {
    expect(None[method]()).toBe(false);
  });
});

describe(".isSomeAnd", () => {
  const method = m[1];
  test("Some: 콜백 함수로부터 반환된 boolean을 반환", () => {
    expect(Some(1)[method](returnT)).toBe(true);
    expect(Some(1)[method](returnF)).toBe(false);
  });

  test("None: `false`를 반환", () => {
    expect(None[method](returnT)).toBe(false);
    expect(None[method](returnF)).toBe(false);
  });
});

describe(".isNone", () => {
  const method = m[2];
  test("Some: `false`를 반환", () => {
    expect(Some(1)[method]()).toBe(false);
  });

  test("None: `true`를 반환", () => {
    expect(None[method]()).toBe(true);
  });
});

describe(".expect", () => {
  const method = m[3];
  test("Some: 내부의 값을 반환", () => {
    expect(Some(1)[method]("")).toBe(1);
  });

  test("None: 오류를 발생", () => {
    try {
      None[method]("abcdefg");
    } catch (err: any) {
      expect(() => {
        None[method]("abcdefg");
      }).toThrow(err);
    }
  });
});

describe(".unwrap", () => {
  const method = m[4];
  test("Some: 내부의 값을 반환", () => {
    expect(Some(1)[method]()).toBe(1);
  });

  test("None: 오류를 발생", () => {
    try {
      None[method]();
    } catch (err: any) {
      expect(() => {
        None[method]();
      }).toThrow(err);
    }
  });
});

describe(".unwrapOr", () => {
  const method = m[5];
  test("Some: 내부의 값을 반환", () => {
    expect(Some(1)[method](2)).toBe(1);
  });

  test("None: 인수를 반환", () => {
    expect(None[method](2)).toBe(2);
  });
});

describe(".unwrapOrElse", () => {
  const method = m[6];
  test("Some: 내부의 값을 반환", () => {
    expect(Some(1)[method](() => 2)).toBe(1);
  });

  test("None: 콜백 함수로부터 반환된 값을 반환", () => {
    expect(None[method](() => 2)).toBe(2);
  });
});

describe(".unwrapUnchecked", () => {
  const method = m[7];
  test("Some: 내부의 값을 반환", () => {
    expect(Some(1)[method]()).toBe(1);
  });

  test("None: 오류를 발생", () => {
    try {
      None[method]();
    } catch (err: any) {
      expect(() => {
        None[method]();
      }).toThrow(err);
    }
  });
});

describe(".map", () => {
  const method = m[8];
  test("Some: 콜백 함수로부터 반환된 값을 포함한 Some을 반환", () => {
    const mapped = Some(1)[method](inc);
    expect(mapped).toEqual(Some(2));
    expect(mapped.unwrap()).toBe(2);
  });

  test("None: None을 반환", () => {
    expect(None[method](inc)).toEqual(None);
    expect(None[method](inc)).toBe(None);
  });
});

describe(".inspect", () => {
  const method = m[9];
  test("Some & None: `this`을 반환", () => {
    let opt: Option<number> = Some(1);
    expect(opt[method](nope)).toBe(opt);
    opt = None;
    expect(opt[method](nope)).toBe(opt);
  });

  test("Some: 콜백 함수를 호출", () => {
    let x = 1;
    let y = 10;
    Some(10).inspect((n) => {
      x = n;
    });
    expect(x).toBe(y);
  });
});

describe(".mapOr", () => {
  const method = m[10];
  test("Some: 콜백 함수로부터 반환된 값을 반환", () => {
    const mapped = Some(1)[method](5, inc);
    expect(mapped).toBe(2);
  });

  test("None: 인수 값을 반환", () => {
    const x = 5;
    expect(None[method](x, inc)).toBe(x);
  });
});

describe(".mapOrElse", () => {
  const method = m[11];
  test("Some: 두번째 콜백 함수로부터 반환된 값을 반환", () => {
    const mapped = Some(1)[method](() => 5, inc);
    expect(mapped).toBe(2);
  });

  test("None: 첫번째 콜백 함수로부터 반환된 값을 반환", () => {
    const x = 5;
    expect(None[method](() => x, inc)).toBe(x);
  });
});

describe(".okOr", () => {
  const method = m[12];
  test("Some: 내부의 값을 포함한 Ok를 반환", () => {
    const x = 1;
    const ok = Some(x)[method]("");
    expect(ok).toEqual(Ok(x));
    expect(ok.unwrap()).toBe(x);
  });

  test("None: 인수의 값을 포함한 Err를 반환", () => {
    const x = 1;
    const err = None[method](x);
    expect(err).toEqual(Err(x));
    expect(err.unwrapErr()).toBe(x);
  });
});

describe(".okOrElse", () => {
  const method = m[13];
  test("Some: 내부의 값을 포함한 Ok를 반환", () => {
    const x = 1;
    const ok = Some(x)[method](() => "");
    expect(ok).toEqual(Ok(x));
    expect(ok.unwrap()).toBe(x);
  });

  test("None: 콜백 함수로부터 반환된 값을 포함한 Err를 반환", () => {
    const x = 1;
    const err = None[method](() => x);
    expect(err).toEqual(Err(x));
    expect(err.unwrapErr()).toBe(x);
  });
});

describe(".and", () => {
  const some1 = Some(1);
  const some2 = Some(2);

  test("Some: 인수(Option)를 반환", () => {
    expect(some1.and(some2)).toBe(some2);
  });

  test("None: None을 반환", () => {
    expect(None.and(some2)).toBe(None);
  });
});

describe(".andThen", () => {
  const some = Some(1);
  const some2 = Some(2);

  test("Some: 인수(Option)를 반환", () => {
    expect(some.andThen(() => some2)).toBe(some2);
    expect(some.andThen(() => None)).toBe(None);
  });

  test("None: None을 반환", () => {
    expect(None.andThen(() => some2)).toBe(None);
  });
});

describe(".filter", () => {
  test("Some: 콜백 함수로부터 참이 반환되면 this, 거짓이면 None을 반환", () => {
    const some = Some(1);
    expect(some.filter(returnT)).toBe(some);
    expect(some.filter(returnF)).toBe(None);
  });

  test("None: None을 반환", () => {
    expect(None.filter(returnT)).toBe(None);
  });
});

describe(".or", () => {
  test("Some: this를 반환", () => {
    const some = Some(1);
    expect(some.or(Some(2))).toBe(some);
  });

  test("None: 인수(Option)을 반환", () => {
    const some = Some(1);
    expect(None.or(some)).toBe(some);
    expect(None.or(None)).toBe(None);
  });
});

describe(".orElse", () => {
  test("Some: this를 반환", () => {
    const some = Some(1);
    expect(some.orElse(() => Some(""))).toBe(some);
  });

  test("None: 인수(Option)을 반환", () => {
    const some = Some(1);
    expect(None.orElse(() => some)).toBe(some);
    expect(None.orElse(() => None)).toBe(None);
  });
});

describe(".xor", () => {
  const some = Some(1);
  const some2 = Some(2);

  test("Some: 인수(Option)가 Some이면 None, None이면 this를 반환", () => {
    expect(some.xor(some2)).toBe(None);
    expect(some.xor(None)).toBe(some);
  });

  test("None: 인수(Option)가 Some이면 Some, None이면 None을 반환", () => {
    expect(None.xor(some2)).toBe(some2);
    expect(None.xor(None)).toBe(None);
  });
});

describe(".zip", () => {
  const x = 1;
  const y = "abcdefg";
  const someX = Some(x);
  const someY = Some(y);

  test("Some: 인수(Option)가 Some이면 Some([x, y]), None이면 None을 반환", () => {
    const zipped = someX.zip(someY);
    expect(zipped).toEqual(Some([x, y]));
    expect(someX.zip(None)).toBe(None);
  });

  test("None: None을 반환", () => {
    expect(None.zip(someX)).toBe(None);
  });
});

describe(".zipWith", () => {
  const x = 1;
  const y = "abcdefg";
  const someX = Some(x);
  const someY = Some(y);

  test("Some: 인수(Option)가 Some이면 Some(f(x, y)), None이면 None을 반환", () => {
    const zipped = someX.zipWith(someY, add);
    expect(zipped).toEqual(Some(add(x, y)));
    expect(someX.zipWith(None, add)).toBe(None);
  });

  test("None: None을 반환", () => {
    expect(None.zipWith(someX, add)).toBe(None);
  });
});

describe(".transpose", () => {
  const method = m[22];

  test("Some: 내부의 값이 Ok<T>이면 Ok<Some<T>>, Err이면 Ok<T>을 반환", () => {
    expect(Some(Ok(1))[method]()).toEqual(Ok(Some(1)));
    expect(Some(Err(2))[method]()).toEqual(Err(2));
  });

  test("None: OK(None)을 반환", () => {
    expect(None[method]()).toEqual(Ok(None));
  });
});
