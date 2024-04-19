import { type Result, TOk, TErr, Ok, Err } from "@repo/result";
import { isEqual } from "@/helper";
import {
  throwUnwrapFailed,
  throwUnreachableUnchecked,
  throwExpectFailed,
} from "@/error";

export interface Option<T>
  extends IStateCheckable<T>,
    IWrapped<T>,
    IMappable<T>,
    IFunctional<T>,
    ICircuitEvaluable<T>,
    IZippable<T>,
    ITransformable<T>,
    IComparable<T> {}

interface IStateCheckable<T> {
  /**
   * [`Option`]이 `Some`이면 `true`를 반환합니다.
   */
  isSome(): boolean;

  /**
   * [`Option`]이 `Some`이고, 내부 값이 콜백 함수의 결과값과 일치하면 `true`를 반환합니다.
   * @param f
   */
  isSomeAnd(f: (value: T) => boolean): boolean;

  /**
   * [`Option`]이 `None`이면 `true`를 반환합니다.
   */
  isNone(): boolean;
}

interface IWrapped<T> {
  /**
   * 내부 값을 반환합니다.
   * 사용자 지정 오류 메시지 `msg`와 함께 [`Option`]이 `None`이면 오류 처리합니다.
   * @param msg
   */
  expect(msg: string): T;

  /**
   * 내부 값을 반환합니다.
   * [`Option`]이 `None`이면 오류 처리합니다.
   * @param msg
   */
  unwrap(): T;

  /**
   * [`Option`]이 `Some`이면 내부 값을 반환하고, `None`이면 제공된 값을 반환합니다.
   * @param value
   */
  unwrapOr(val: T): T;

  /**
   * [`Option`]이 `Some`이면 내부 값을 반환하고, `None`이면 콜백 함수의 결과값을 반환합니다.
   * @param f
   */
  unwrapOrElse(f: () => T): T;
}

interface IMappable<T> {
  /**
   * [`Option`]이 `Some`이면 내부 값에 함수를 적용하여 [`Option<T>`]를 [`Option<U>`]로 매핑하고, `None`이면 `None`을 반환합니다.
   * @param op
   */
  map<U>(op: (value: T) => U): Option<U>;

  /**
   * [`Option`]이 `None`이면 제공된 값을 반환하고, `Some`이면 내부 값에 함수를 적용해서 반환합니다.
   * @param value
   * @param op
   */
  mapOr<U>(value: U, op: (value: T) => U): U;

  /**
   * [`Option`]이 `None`이면 제공된 함수의 결과값을 반환하고, `Some`이면 내부 값에 다른 함수를 적용해서 반환합니다.
   * @param fn
   * @param op
   */
  mapOrElse<U>(fn: () => U, op: (value: T) => U): U;
}

interface IFunctional<T> {
  /**
   * [`Option`]이 `None`이면 `None`을 반환하고, 그렇지 않으면 내부 값으로 `predicate`를 호출하고 결과에 따라 내부 값이나 `None`을 반환합니다.
   * @param predicate
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * [`Option`]이 `Some`이면 내부 값에 대한 콜백 함수를 호출합니다.
   * @param f
   */
  inspect(f: (value: T) => void): Option<T>;
}

interface ICircuitEvaluable<T> {
  /**
   * [`Option`]이 `Some`이면 `optb`를 반환하고, 그렇지 않으면 `None`을 반환합니다.
   * @param optb
   */
  and<U>(optb: Option<U>): Option<U>;

  /**
   * [`Option`]이 `Some`이면 내부 값으로 함수를 호출하여 결과를 반환하고, 아니면 `None`을 반환합니다.
   * @param f
   */
  andThen<U>(f: (value: T) => Option<U>): Option<U>;

  /**
   * [`Option`]이 `Some`이면 `this`를 반환하고, 아니면 `optb`를 반환합니다.
   * @param optb
   */
  or(optb: Option<T>): Option<T>;

  /**
   * [`Option`]이 `Some`이면 `this`를 반환하고, 아니면 `f`를 호출하여 결과를 반환합니다.
   * @param f
   */
  orElse(f: () => Option<T>): Option<T>;

  /**
   * 피연산자 중 하나만 `Some`이면 `Some`을 반환하고, 아니면 `None`을 반환합니다.
   * @param optb
   */
  xor(optb: Option<T>): Option<T>;
}

interface IZippable<T> {
  /**
   * 두 [`Option`]이 모두 `Some`이면 내부 값을 튜플 형식으로 압축합니다. 그렇지 않으면 `None`을 반환합니다.
   * @param other
   */
  zip<U>(other: Option<U>): Option<[T, U]>;

  /**
   * 두 [`Option`]이 모두 `Some`이면 두 내부 값으로 `f` 함수를 호출한 결과로 압축합니다. 그렇지 않으면 `None`을 반환합니다.
   * @param other
   * @param f
   */
  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R>;
}

interface ITransformable<T> {
  /**
   * [`Option<T>`]을 [`Result<T, E>`]로 변환합니다.
   * - `Some(v)`을 `Ok(v)`로 매핑
   * - `None`을 `Err(err)`로 매핑
   * @param err
   */
  okOr<E>(err: E): Result<T, E>;

  /**
   * [`Option<T>`]을 [`Result<T, E>`]로 변환합니다.
   * - `Some(v)`을 `Ok(v)`로 매핑
   * - `None`을 `Err(err())`로 매핑
   * @param err
   */
  okOrElse<E>(err: () => E): Result<T, E>;

  /**
   * [`Option<T>`]을 [`Promise<T>`]로 변환합니다.
   * - `Some(v)`을 `Promise.resolve(v)`로 매핑
   * - `None`을 `Promise.reject(err)`로 매핑
   * @param err
   */
  resolveOr<E>(err: E): Promise<T>;

  /**
   * [`Option<T>`]을 [`Promise<T>`]로 변환합니다.
   * - `Some(v)`을 `Promise.resolve(v)`로 매핑
   * - `None`을 `Promise.reject(err())`로 매핑
   * @param err
   */
  resolveOrElse<E>(err: () => E): Promise<T>;

  /**
   * [`Option<Result<T, E>>`]을 [`Result<Option<T>, E>`]로 변환합니다.
   * - `Some(Ok(v))`을 `Ok(Some(v))`로 매핑
   * - `Some(Err(v))`을 `Err(v)`로 매핑
   * - `None`을 `Ok(None)`로 매핑
   */
  transpose<E>(): Result<Option<T>, E>;

  /**
   * [`Option<Promise<T>>`]을 [`Promise<Option<T>>`]로 변환합니다.
   * - `Some(Promise.resolve(v))`을 `Promise.resolve(Some(v))`로 매핑
   * - `None`을 `Promise.resolve(None)`로 매핑
   */
  transposeAsync<R>(): Promise<Option<R>>;
}

interface IComparable<T> {
  /**
   * `this`와 `other`의 내부 값이 동등한 지 비교합니다.
   * @param other
   */
  equal(other: Option<T>): boolean;
}

export class TSome<T> implements Option<T> {
  #inner: T;

  constructor(expr: T) {
    this.#inner = expr;
  }

  isSome(): boolean {
    return true;
  }

  isSomeAnd(f: (value: T) => boolean): boolean {
    return f(this.#inner);
  }

  isNone(): boolean {
    return false;
  }

  expect(msg: string): T {
    return this.#inner;
  }

  unwrap(): T {
    return this.#inner;
  }

  unwrapOr(val: T): T {
    return this.#inner;
  }

  unwrapOrElse(f: () => T): T {
    return this.#inner;
  }

  map<U>(op: (value: T) => U): Option<U> {
    return Some(op(this.#inner));
  }

  mapOr<U>(value: U, op: (value: T) => U): U {
    return op(this.#inner);
  }

  mapOrElse<U>(fn: () => U, op: (value: T) => U): U {
    return op(this.#inner);
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return predicate(this.#inner) ? this : None;
  }

  inspect(f: (value: T) => void): Option<T> {
    f(this.#inner);
    return this;
  }

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U>(f: (value: T) => Option<U>): Option<U> {
    return f(this.#inner);
  }

  or(optb: Option<T>): Option<T> {
    return this;
  }

  orElse(f: () => Option<T>): Option<T> {
    return this;
  }

  xor(optb: Option<T>): Option<T> {
    return optb === None ? this : None;
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return other.isSome() ? Some([this.#inner, other.unwrap()]) : None;
  }

  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R> {
    return other.isSome() ? Some(f(this.#inner, other.unwrap())) : None;
  }

  okOr<E>(err: E): Result<T, E> {
    return Ok(this.#inner);
  }

  okOrElse<E>(err: () => E): Result<T, E> {
    return Ok(this.#inner);
  }

  resolveOr<E>(err: E): Promise<T> {
    return Promise.resolve(this.#inner);
  }

  resolveOrElse<E>(err: () => E): Promise<T> {
    return Promise.resolve(this.#inner);
  }

  transpose<E>(): Result<Option<T>, E> {
    if (this.#inner instanceof TOk) return Ok(Some(this.#inner.unwrap()));
    if (this.#inner instanceof TErr) return this.#inner;
    throwUnreachableUnchecked();
  }

  transposeAsync<R>(): Promise<Option<R>> {
    return this.#inner instanceof Promise
      ? this.#inner.then(Some)
      : throwUnreachableUnchecked();
  }

  equal(other: Option<T>): boolean {
    return other instanceof TSome && isEqual(this.#inner, other.unwrap());
  }
}

export class TNone implements Option<any> {
  isSome(): boolean {
    return false;
  }

  isSomeAnd(f: (value: any) => boolean): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  expect(msg: string): never {
    throwExpectFailed(msg);
  }

  unwrap(): never {
    throwUnwrapFailed("called `unwrap()` on a `None` value");
  }

  unwrapOr<T>(value: T): T {
    return value;
  }

  unwrapOrElse<T>(f: () => T): T {
    return f();
  }

  map<U>(op: (value: any) => U): Option<U> {
    return None;
  }

  mapOr<U>(value: U, op: (value: any) => U): U {
    return value;
  }

  mapOrElse<U>(fn: () => U, op: (value: any) => U): U {
    return fn();
  }

  filter(predicate: (value: any) => boolean): Option<any> {
    return None;
  }

  inspect(f: (value: any) => void): Option<any> {
    return None;
  }

  and<U>(optb: Option<U>): Option<U> {
    return this;
  }

  andThen<U>(f: (value: any) => Option<U>): Option<U> {
    return this;
  }

  or(optb: Option<any>): Option<any> {
    return optb;
  }

  orElse(f: () => Option<any>): Option<any> {
    return f();
  }

  xor(optb: Option<any>): Option<any> {
    return optb !== None ? optb : None;
  }

  zip<U>(other: Option<U>): Option<[never, U]> {
    return None;
  }

  zipWith<U, R>(other: Option<U>, f: (t: never, u: U) => R): Option<R> {
    return None;
  }

  okOr<E>(err: E): Result<any, E> {
    return Err(err);
  }

  okOrElse<E>(err: () => E): Result<any, E> {
    return Err(err());
  }

  resolveOr<E>(err: E): Promise<any> {
    return Promise.reject(err);
  }

  resolveOrElse<E>(err: () => E): Promise<any> {
    return Promise.reject(err());
  }

  transpose<E>(): Result<Option<any>, E> {
    return Ok(None);
  }

  transposeAsync(): Promise<Option<any>> {
    return Promise.resolve(None);
  }

  equal(other: Option<never>): boolean {
    return other === None;
  }
}

/**
 * [`Option<T>`] 타입의 Some 객체를 생성합니다.
 * @param expr
 */
export const Some = <T>(expr: T): Option<T> => new TSome(expr);

/**
 * [`Option<T>`] 타입의 None 객체를 생성합니다.
 */
export const None: Option<any> = new TNone();

/**
 * 전역 상에 [`Option<T>`] 타입의 객체 생성자들을 초기화합니다.
 */
export const defineOption = (): void => {
  if ("Some" in globalThis || "None" in globalThis) {
    throw new Error(
      "Define Failed: `Some` or `None` functions are already defined in the global scope."
    );
  }

  Object.defineProperties(globalThis, {
    Some: {
      value: Some,
    },
    None: {
      value: None,
    },
  });
};
