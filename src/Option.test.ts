import { Some, None } from ".";
import { Ok, Err } from "./Result";

/*
 * Issue #1
 * None의 타입 호환 문제
 *
 * 메서드 목록:
 * - .unwrapOr
 * - .unwrapOrElse
 * - .or(None)
 * - .orElse(None)
 * - .xor
 * - .equal
 *
 * 해결 방법:
 * - Option<never>에서 Option<any>로 타입 변경
 * - 타입과 함께 변수 선언
 * - Some으로 변수를 초기화하고 None을 할당
 */

/*
 * Issue #2
 * UnhandledPromiseRejection 오류:
 * 프로미스가 거부되었지만, 해당 거부를 처리하는 .catch() 블록이 없을 때 발생
 *
 * await expect(err).rejects.toEqual(Err(x));가 에러 나는 이유:
 * Err(x)가 거부 처리를 못함.
 */

// const Ok = <T>(x: T): Promise<T> => Promise.resolve(x);
// const Err = (x: any): Promise<any> => Promise.reject(x);

const someInner = 1;
const fallback = 5;
const msg = "abcdefg";
const some = Some(someInner);

describe("Option state checkable methods", () => {
  const returnT = () => true;
  const returnF = () => false;

  test(".isSome", () => {
    expect(some.isSome()).toBe(true);
    expect(None.isSome()).toBe(false);
  });

  test(".isSomeAnd", () => {
    expect(some.isSomeAnd(returnT)).toBe(true);
    expect(some.isSomeAnd(returnF)).toBe(false);
    expect(None.isSomeAnd(returnT)).toBe(false);
    expect(None.isSomeAnd(returnF)).toBe(false);
  });

  test(".isNone", () => {
    expect(some.isNone()).toBe(false);
    expect(None.isNone()).toBe(true);
  });
});

describe("Option wrapped methods", () => {
  test(".expect", () => {
    expect(some.expect(msg)).toBe(someInner);
    expect(() => {
      None.expect(msg);
    }).toThrow(msg);
  });

  test(".unwrap", () => {
    expect(some.unwrap()).toBe(someInner);
    expect(() => {
      None.unwrap();
    }).toThrow();
  });

  test(".unwrapOr", () => {
    expect(some.unwrapOr(fallback)).toBe(someInner);
    expect(None.unwrapOr(fallback)).toBe(fallback);
  });

  test(".unwrapOrElse", () => {
    expect(some.unwrapOrElse(() => fallback)).toBe(someInner);
    expect(None.unwrapOrElse(() => fallback)).toBe(fallback);
  });
});

describe("Option mappable methods", () => {
  const inc = (n: number) => ++n;
  const increased = inc(someInner);

  test(".map", () => {
    const mapped = some.map(inc);
    expect(mapped).toEqual(Some(increased));
    expect(mapped.unwrap()).toBe(increased);
    expect(None.map(inc)).toBe(None);
    expect(None.map(inc)).toEqual(None);
  });

  test(".mapOr", () => {
    expect(some.mapOr(fallback, inc)).toEqual(increased);
    expect(None.mapOr(fallback, inc)).toBe(fallback);
  });

  test(".mapOrElse", () => {
    expect(some.mapOrElse(() => fallback, inc)).toEqual(increased);
    expect(None.mapOrElse(() => fallback, inc)).toBe(fallback);
  });
});

describe("Option functional methods", () => {
  const returnT = () => true;
  const returnF = () => false;

  test(".filter", () => {
    expect(some.filter(returnT)).toBe(some);
    expect(some.filter(returnF)).toBe(None);
    expect(None.filter(returnT)).toBe(None);
    expect(None.filter(returnF)).toBe(None);
  });

  test(".inspect", () => {
    expect(some.filter(returnT)).toBe(some);
    expect(some.filter(returnF)).toBe(None);
    expect(None.filter(returnT)).toBe(None);
    expect(None.filter(returnF)).toBe(None);
  });
});

describe("Option circuit evaluable methods", () => {
  const some2 = Some(3);

  test(".and", () => {
    expect(some.and(some2)).toBe(some2);
    expect(None.and(some2)).toBe(None);
  });

  test(".andThen", () => {
    expect(some.andThen(() => some2)).toBe(some2);
    expect(None.andThen(() => some2)).toBe(None);
  });

  test(".or", () => {
    expect(some.or(some2)).toBe(some);
    expect(None.or(some2)).toBe(some2);
  });

  test(".orElse", () => {
    expect(some.orElse(() => some2)).toBe(some);
    expect(None.orElse(() => some2)).toBe(some2);
  });

  test(".xor", () => {
    expect(some.xor(some2)).toBe(None);
    expect(some.xor(None)).toBe(some);
    expect(None.xor(some2)).toBe(some2);
    expect(None.xor(None)).toBe(None);
  });
});

describe("Option zippable methods", () => {
  const some2Inner = 3;
  const some2 = Some(some2Inner);

  test(".zip", () => {
    expect(some.zip(some2)).toEqual(Some([someInner, some2Inner]));
    expect(None.zip(some2)).toBe(None);
  });

  test(".zipWith", () => {
    const add = (a: number, b: number) => a + b;
    const added = 4;

    expect(some.zipWith(some2, add).unwrap()).toBe(added);
    expect(None.zipWith(some2, add)).toBe(None);
  });
});

describe("Option transformable methods", () => {
  const err = new Error("abcdefg");

  test(".okOr", () => {
    expect(some.okOr(err)).toEqual(Ok(someInner));
    expect(None.okOr(err)).toEqual(Err(err));
  });

  test(".okOrElse", () => {
    expect(some.okOrElse(() => err)).toEqual(Ok(someInner));
    expect(None.okOrElse(() => err)).toEqual(Err(err));
  });

  test(".resolveOr", () => {
    expect(some.resolveOr(err)).resolves.toBe(someInner);
    expect(None.resolveOr(err)).rejects.toBe(err);
  });

  test(".resolveOrElse", () => {
    expect(some.resolveOrElse(() => err)).resolves.toBe(someInner);
    expect(None.resolveOrElse(() => err)).rejects.toBe(err);
  });

  test(".transpose", () => {
    expect(Some(Ok(1))).toEqual(Ok(Some(1)));
    expect(Some(Err(1))).toEqual(Err(1));
    expect(None).toEqual(Ok(None));
  });

  test(".transposeAsync", () => {
    expect(Some(Promise.resolve(1)).transposeAsync()).resolves.toEqual(Some(1));
    expect(() => {
      Some(1).transposeAsync();
    }).toThrow();
    expect(None.transposeAsync()).resolves.toBe(None);
  });
});

describe("Option comparable methods", () => {
  test(".equal", () => {
    expect(Some(1).equal(Some(1))).toBe(true);
    expect(Some(Ok(2)).equal(Some(Ok(2)))).toBe(true);
    expect(Some(Ok(Ok(3))).equal(Some(Ok(Ok(3))))).toBe(true);
    expect(Some(Ok(Err(3))).equal(Some(Ok(Err(3))))).toBe(true);
    expect(None.equal(None)).toBe(true);
  });
});
