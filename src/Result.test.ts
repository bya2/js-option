import { Ok, Err } from "@repo/result";
import { Some, None } from "@repo/option";

const okInner = 1;
const errInner = "a";
const fallback = 5;
const msg = "abcdefg";
const ok = Ok(okInner);
const err = Err(errInner);

describe("Result state checkable methods", () => {
  const returnT = () => true;
  const returnF = () => false;

  test(".isOk", () => {
    expect(ok.isOk()).toBe(true);
    expect(err.isOk()).toBe(false);
  });

  test(".isOkAnd", () => {
    expect(ok.isOkAnd(returnT)).toBe(true);
    expect(ok.isOkAnd(returnF)).toBe(false);
    expect(err.isOkAnd(returnT)).toBe(false);
    expect(err.isOkAnd(returnF)).toBe(false);
  });

  test(".isErr", () => {
    expect(ok.isErr()).toBe(false);
    expect(err.isErr()).toBe(true);
  });

  test(".isErrAnd", () => {
    expect(ok.isErrAnd(returnT)).toBe(false);
    expect(ok.isErrAnd(returnF)).toBe(false);
    expect(err.isErrAnd(returnT)).toBe(true);
    expect(err.isErrAnd(returnF)).toBe(false);
  });
});

describe("Result wrapped methods", () => {
  test(".expect", () => {
    expect(ok.expect(msg)).toBe(okInner);
    expect(() => {
      err.expect(msg);
    }).toThrow(msg);
  });

  test(".expectErr", () => {
    expect(() => {
      ok.expectErr(msg);
    }).toThrow(msg);
    expect(err.expectErr(msg)).toBe(errInner);
  });

  test(".unwrap", () => {
    expect(ok.unwrap()).toBe(okInner);
    expect(() => {
      err.unwrap();
    }).toThrow();
  });

  test(".unwrapErr", () => {
    expect(() => {
      ok.unwrapErr();
    }).toThrow();
    expect(err.unwrapErr()).toBe(errInner);
  });

  test(".unwrapOr", () => {
    expect(ok.unwrapOr(fallback)).toBe(okInner);
    expect(err.unwrapOr(fallback)).toBe(fallback);
  });

  test(".unwrapOrElse", () => {
    expect(ok.unwrapOrElse(() => fallback)).toBe(okInner);
    expect(err.unwrapOrElse(() => fallback)).toBe(fallback);
  });
});

describe("Result mappable methods", () => {
  const inc = (n: any) => n + 1;
  const increased = inc(okInner);

  const add = (s: any) => s + "b";
  const added = "ab";

  test(".map", () => {
    const mappedOk = ok.map(inc);
    expect(mappedOk).toEqual(Ok(increased));
    expect(mappedOk.unwrap()).toBe(increased);

    const mappedErr = err.map(add);
    expect(mappedErr).toEqual(err);
    expect(mappedErr.unwrapErr()).toBe(errInner);
  });

  test(".mapOr", () => {
    expect(ok.mapOr(fallback, inc)).toBe(increased);
    expect(err.mapOr(fallback, inc)).toBe(fallback);
  });

  test(".mapOrElse", () => {
    expect(ok.mapOrElse(() => fallback, inc)).toBe(increased);
    expect(err.mapOrElse(() => fallback, inc)).toBe(fallback);
  });

  test(".mapErr", () => {
    const mappedOk = ok.mapErr(inc);
    expect(mappedOk).toEqual(ok);
    expect(mappedOk.unwrap()).toBe(okInner);

    const mappedErr = err.mapErr(add);
    expect(mappedErr).toEqual(Err(added));
    expect(mappedErr.unwrapErr()).toBe(added);
  });
});

describe("Result functional methods", () => {
  const noop = () => {};

  test(".inspect", () => {
    expect(ok.inspect(noop)).toBe(ok);
    expect(err.inspect(noop)).toBe(err);
  });

  test(".inspectErr", () => {
    expect(ok.inspectErr(noop)).toBe(ok);
    expect(err.inspectErr(noop)).toBe(err);
  });
});

describe("Result circuit evaluable methods", () => {
  const ok2 = Ok(2);
  const err2 = Err("c");

  test(".and", () => {
    expect(ok.and(ok2)).toBe(ok2);
    expect(err.and(err2)).toBe(err);
  });

  test(".andThen", () => {
    expect(ok.andThen(() => ok2)).toBe(ok2);
    expect(err.andThen(() => err2)).toBe(err);
  });

  test(".or", () => {
    expect(ok.or(ok2)).toBe(ok);
    expect(err.or(err2)).toBe(err2);
  });

  test(".orElse", () => {
    expect(ok.orElse(() => ok2)).toBe(ok);
    expect(err.orElse(() => err2)).toBe(err2);
  });
});

describe("Result transformable methods", () => {
  test(".ok", () => {
    expect(ok.ok()).toEqual(Some(okInner));
    expect(err.ok()).toBe(None);
  });

  test(".err", () => {
    expect(ok.err()).toBe(None);
    expect(err.err()).toEqual(Some(errInner));
  });

  test(".promise", () => {
    expect(ok.promise()).resolves.toBe(okInner);
    expect(err.promise()).rejects.toBe(errInner);
  });

  test(".transpose", () => {
    expect(Ok(Some(1)).transpose()).toEqual(Some(Ok(1)));
    expect(Ok(None).transpose()).toBe(None);
    expect(err.transpose()).toEqual(Some(err));
  });

  test(".transposeAsync", () => {
    expect(Ok(Promise.resolve(1)).transposeAsync()).resolves.toEqual(Ok(1));
    expect(() => {
      Ok(1).transposeAsync();
    }).toThrow();
    expect(err.transposeAsync()).resolves.toEqual(err);
  });
});

describe("Result comparable methods", () => {
  test(".equal", () => {
    expect(Ok(1).equal(Ok(1))).toBe(true);
    expect(Ok(Some(2)).equal(Ok(Some(2)))).toBe(true);
    expect(Ok(Some(Some(3))).equal(Ok(Some(Some(3))))).toBe(true);
    expect(Ok(Some(Err(3))).equal(Ok(Some(Err(3))))).toBe(true);

    expect(Err(1).equal(Err(1))).toBe(true);
    expect(Err(Some(2)).equal(Err(Some(2)))).toBe(true);
    expect(Err(Some(Some(3))).equal(Err(Some(Some(3))))).toBe(true);
    expect(Err(Some(Ok(3))).equal(Err(Some(Ok(3))))).toBe(true);
  });
});
