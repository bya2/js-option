import { Some, None } from "./Option";
import { Ok, Err } from "./Result";

describe("Option methods", () => {
  test("isSome / isNone", () => {
    let x = Some(2);
    expect(x.isSome()).toBe(true);
    expect(x.isNone()).toBe(false);

    x = None;
    expect(x.isSome()).toBe(false);
    expect(x.isNone()).toBe(true);
  });

  test("expect", () => {
    const msg = "abcdefg";
    for (const x of [Some(2), None]) {
      try {
        expect(x.expect(msg)).toBe(x.unwrap());
      } catch (err: any) {
        expect(err.message).toBe(msg);
      }
    }
  });

  test("unwrap / unwrapOr / unwrapOrElse", () => {
    let x = Some(2);
    expect(x.unwrap()).toBe(2);
    expect(x.unwrapOr(3)).toBe(2);
    expect(x.unwrapOrElse(() => 3)).toBe(2);
    expect(x.unwrapUnchecked()).toBe(2);

    x = None;
    try {
      x.unwrap();
    } catch (err: any) {
      expect(err.message).toBe("called `Option.prototype.unwrap()` on a `None` value");
    }

    expect(x.unwrapOr(3)).toBe(3);
    expect(x.unwrapOrElse(() => 4)).toBe(4);

    try {
      x.unwrapUnchecked();
    } catch (err: any) {
      expect(err.message).toBe("Unreachable code executed");
    }
  });

  test("map / mapOr / mapOrElse", () => {
    const a = 5;
    let x = Some(a);
    expect(x.map(n => n + 2).unwrap()).toBe(a + 2);
    expect(x.mapOr(a, n => n + 2)).toBe(a + 2);
    expect(
      x.mapOrElse(
        () => a,
        n => n + 2,
      ),
    ).toBe(a + 2);

    x = None;
    expect(x.map(n => n + 2)).toBe(None);
    expect(x.mapOr(a, n => n + 2)).toBe(a);
    expect(
      x.mapOrElse(
        () => a,
        n => n + 2,
      ),
    ).toBe(a);
  });

  test("okOr / okOrElse", () => {
    const msg = "abcdefg";
    const a = "foo";
    let x = Some(a);
    expect(x.okOr(msg).unwrap()).toBe(a);
    expect(x.okOrElse(() => msg).unwrap()).toBe(a);

    x = None;
    expect(x.okOr(msg).unwrapErr()).toBe(msg);
    expect(x.okOrElse(() => msg).unwrapErr()).toBe(msg);
  });

  test("and / andThen", () => {
    const dx = [Some("ba"), None];
    const dy = [Some("foo"), None];
    const df = [(s: string) => Some(s), (s: string) => None];

    for (const x of dx) {
      for (const y of dy) expect(x.and(y)).toBe(x.isSome() ? y : x);
      for (const f of df) expect(x.andThen(f)).toEqual(x.isSome() ? f(x.unwrap()) : x);
    }
  });

  test("filter", () => {
    const x = Some(2);
    expect(x.filter(n => n === 2)).toEqual(x);
    expect(x.filter(n => n !== 2)).toEqual(None);
    expect(None.filter(n => n !== 2)).toEqual(None);
  });

  test("or / orElse / xor", () => {
    const dx = [Some(2), None];
    const dy = [Some(3), None];
    const df = [() => Some(3), () => None];

    for (const x of dx) {
      for (const y of dy) {
        expect(x.or(y)).toEqual(x.isSome() ? x : y);
      }

      for (const f of df) {
        expect(x.orElse(f)).toEqual(x.isSome() ? x : f());
      }

      for (const y of dy) {
        expect(x.xor(y)).toEqual(x.isSome() ? (y.isNone() ? x : None) : x.isNone() && y.isSome() ? y : None);
      }
    }
  });

  test("inspect / insert / getOrInsert / getOrInsertWith", () => {
    const value = 5;
    for (const x of [Some(2), None]) {
      expect(x.inspect(() => {})).toEqual(x);
      try {
        expect(x.insert(value)).toBe(value);
      } catch (err: any) {
        expect(err.message).toBe("Unreachable code executed");
      }
      expect(x.getOrInsert(value)).toBe(x.isSome() ? x.unwrap() : value);
      expect(x.getOrInsertWith(() => value)).toBe(x.isSome() ? x.unwrap() : value);
    }
  });

  test("transpose", () => {
    let x = Some(Ok(2));
    expect(x.transpose()).toEqual(Ok(x.unwrap().unwrap()));
    x = Some(Err("foo"));
    expect(x.transpose()).toEqual(Err(x.unwrap().unwrapErr()));
    x = None;
    expect(x.transpose()).toEqual(Ok(x));
  });

  test("equal", () => {
    const a = { a: 1 };

    [
      [Some(3).equal(Some(3)), true],
      [Some(Ok(2)).equal(Some(Ok(2)), true), true],
      [Some(a).equal(Some({ a: 2 }), true), false],
    ].map(e => {
      expect(e[0]).toBe(e[1]);
    });
  });
});
