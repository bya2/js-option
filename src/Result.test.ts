import { Ok, Err } from "./Result";
import { Some, None } from "./Option";

// expect().rejects.toThrow()는 Promise

const inp = {
  n: 2,
  s: "abcdefg",
  nope: () => {},
  f_bool: () => true,
};

const nope = () => {};

describe("Option methods", () => {
  test("isOk / isOkAnd / isErr / isErrAnd", () => {
    let x = Ok(inp.n);
    [
      {
        actual: x.isOk(),
        expected: true,
      },
      {
        actual: x.isErr(),
        expected: false,
      },
      {
        actual: x.isOkAnd(inp.f_bool),
        expected: true,
      },
      {
        actual: x.isErrAnd(inp.f_bool),
        expected: false,
      },
    ].map(e => {
      expect(e.actual).toBe(e.expected);
    });

    x = Err(inp.n);
    [
      {
        actual: x.isOk(),
        expected: false,
      },
      {
        actual: x.isErr(),
        expected: true,
      },
      {
        actual: x.isOkAnd(inp.f_bool),
        expected: false,
      },
      {
        actual: x.isErrAnd(inp.f_bool),
        expected: true,
      },
    ].map(e => {
      expect(e.actual).toBe(e.expected);
    });
  });

  test("ok / err", () => {
    let x = Ok(inp.n);

    [
      {
        actual: x.ok(),
        expected: Some(x.unwrap()),
      },
      {
        actual: x.err(),
        expected: None,
      },
    ].map(e => {
      expect(e.actual).toEqual(e.expected);
    });

    x = Err(inp.s);

    [
      {
        actual: x.ok(),
        expected: None,
      },
      {
        actual: x.err(),
        expected: Some(x.unwrapErr()),
      },
    ].map(e => {
      expect(e.actual).toEqual(e.expected);
    });
  });

  test("map / mapOr / mapOrElse / mapErr", () => {
    const cb = (n: number) => n + 1;
    const fn = (arg: number) => arg + 2;
    const np = inp.n + 1;

    let x = Ok(inp.n);
    [
      {
        actual: x.map(cb),
        expected: Ok(np),
      },
      {
        actual: x.mapOr(inp.n, cb),
        expected: np,
      },
      {
        actual: x.mapOrElse((err: number) => 1, cb),
        expected: np,
      },
      {
        actual: x.mapErr((arg: number) => 1),
        expected: Ok(inp.n),
      },
    ].map(e => {
      expect(e.actual).toEqual(e.expected);
    });

    x = Err(inp.n);
    [
      {
        actual: x.map(cb),
        expected: Err(inp.n),
      },
      {
        actual: x.mapOr(inp.n, cb),
        expected: inp.n,
      },
      {
        actual: x.mapOrElse((err: number) => err + 2, cb),
        expected: ((err: number) => err + 2)(inp.n),
      },
      {
        actual: x.mapErr((arg: number) => arg + 2),
        expected: Err(((arg: number) => arg + 2)(inp.n)),
      },
    ].map(e => {
      expect(e.actual).toEqual(e.expected);
    });
  });

  test("inspect / inspectErr", () => {
    let x = Ok(inp.n);
    [
      [x.inspect(nope), x],
      [x.inspectErr(nope), x],
    ].map(e => {
      expect(e[0]).toEqual(e[1]);
    });

    x = Err(inp.n);
    [
      [x.inspect(nope), x],
      [x.inspectErr(nope), x],
    ].map(e => {
      expect(e[0]).toEqual(e[1]);
    });
  });

  test("expect / expectErr", () => {
    let x = Ok(inp.n);
    const MSG = "abcdefg";
    expect(x.expect(MSG)).toBe(inp.n);

    expect(() => {
      x.expectErr(MSG);
    }).toThrow(new Error(`${MSG}\n${inp.n}`));

    x = Err(inp.n);
    expect(() => {
      x.expect(MSG);
    }).toThrow(new Error(`${MSG}\n${inp.n}`));

    expect(x.expectErr(MSG)).toBe(inp.n);
  });

  test("unwrap / unwrapOr / unwrapOrElse / unwrapErr / unwrapUnchecked / unwrapErrUnchecked", () => {
    let x = Ok(inp.n);
    [
      [x.unwrap(), inp.n],
      [x.unwrapOr(3), inp.n],
      [x.unwrapOrElse(() => 3), inp.n],
      [x.unwrapUnchecked(), inp.n],
    ].map(e => {
      expect(e[0]).toBe(e[1]);
    });

    expect(() => {
      x.unwrapErr();
    }).toThrow(new Error(`${"called `Result.prototype.unwrapErr()` on an `Ok` value"}\n${inp.n}`));

    expect(() => {
      x.unwrapErrUnchecked();
    }).toThrow(new Error("Unreachable code executed"));

    x = Err(inp.n);
    [
      [x.unwrapOr(3), 3],
      [x.unwrapOrElse(() => 3), 3],
      [x.unwrapErr(), inp.n],
      [x.unwrapErrUnchecked(), inp.n],
    ].map(e => {
      expect(e[0]).toBe(e[1]);
    });

    expect(() => {
      x.unwrap();
    }).toThrow(new Error(`${"called `ResultErr.prototype.unwrap()` on an `Err` value"}\n${inp.n}`));

    expect(() => {
      x.unwrapUnchecked();
    }).toThrow(new Error("Unreachable code executed"));
  });

  test("and / andThen / or / orElse", () => {
    let x = Ok(inp.n);
    let y = Ok(3);
    [
      [x.and(y), y],
      [x.andThen(() => y), y],
      [x.or(y), x],
      [x.orElse(() => y), x],
    ].map(e => {
      expect(e[0]).toEqual(e[1]);
    });

    x = Err(inp.n);
    [
      [x.and(y), x],
      [x.andThen(() => y), x],
      [x.or(y), y],
      [x.orElse(() => y), y],
    ].map(e => {
      expect(e[0]).toEqual(e[1]);
    });
  });

  test("copied", () => {
    let x = Ok(inp.n);
    expect(x.copied()).toEqual(x);
  });

  test("transpose", () => {
    for (const e of [
      [Ok(Some(inp.n)), Some(Ok(inp.n))],
      [Ok(None), None],
      [Err(inp.n), Some(Err(inp.n))],
    ]) {
      expect(e[0].transpose()).toEqual(e[1]);
    }
  });
});
