import { type Option, TSome, Some, None } from "@repo/option";
import { isEqual } from "@/helper";
import { throwUnreachableUnchecked, throwUnwrapFailed } from "@/error";

export interface Result<T, E>
  extends IStateCheckable<T, E>,
    IWrapped<T, E>,
    IMappable<T, E>,
    IFunctional<T, E>,
    ICircuitEvaluable<T, E>,
    ITransformable<T, E>,
    IComparable<T, E> {}

interface IStateCheckable<T, E> {
  /**
   * [`Result`]가 `Ok`이면, `true`를 반환합니다.
   */
  isOk(): boolean;

  /**
   * [`Result`]가 `Ok`이고 내부 값으로 호출한 술어와 일치하면 `true`를 반환합니다.
   * @param f
   */
  isOkAnd(f: (value: T) => boolean): boolean;

  /**
   * [`Result`]가 `Err`이면 `true`를 반환합니다.
   */
  isErr(): boolean;

  /**
   * [`Result`]가 `Err`이고 내부 값으로 호출한 술어와 일치하면 `true`를 반환합니다.
   * @param f
   */
  isErrAnd(f: (error: E) => boolean): boolean;
}

interface IWrapped<T, E> {
  /**
   * [`Result`]가 `Ok`이면 내부 값을 반환하고, `Err`이면 제공된 메시지를 통해 오류를 발생시킵니다.
   * @param msg
   */
  expect(msg: string): T;

  /**
   * [`Result`]가 `Err`이면 내부 값을 반환하고, `Ok`이면 제공된 메시지를 통해 오류를 발생시킵니다.
   * @param msg
   */
  expectErr(msg: string): E;

  /**
   * [`Result`]가 `Ok`이면 내부 값을 반환하고, `Err`이면 오류를 발생시킵니다.
   */
  unwrap(): T;

  /**
   * [`Result`]가 `Err`이면 내부 값을 반환하고, `Ok`이면 오류를 발생시킵니다.
   */
  unwrapErr(): E;

  /**
   * [`Result`]가 `Ok`이면 내부 값을 반환하고, `Err`이면 제공된 값을 반환합니다.
   * @param value
   */
  unwrapOr(value: T): T;

  /**
   * [`Result`]가 `Ok`이면 내부 값을 반환하고, `Err`이면 내부 값으로 함수를 호출하여 결과값을 반환합니다.
   * @param op
   */
  unwrapOrElse(op: (error: E) => T): T;
}

interface IMappable<T, E> {
  /**
   * [`Result<T, E>`]를 [`Result<U, E>`]로 매핑하여 반환합니다.
   * - `Ok`이면 내부 값을 함수에 적용하여 [`Result<T, E>`]를 [`Result<U, E>`]로 매핑힙니다.
   * - `Err`이면 값을 그대로 두고, [`Result<U, E>`]로 매핑합니다.
   * @param op
   */
  map<U>(op: (value: T) => U): Result<U, E>;

  /**
   * [`Result`]가 `Err`이면 제공된 값을 반환하고, `Ok`이면 내부 값을 함수에 적용하여 결과값을 반환합니다.
   * @param value
   * @param op
   */
  mapOr<U>(value: U, op: (value: T) => U): U;

  /**
   * [`Result`]가 `Err`이면 내부 값으로 함수(`fn`)를 호출하여 결과값을 반환하고, `Ok`이면 내부 값을 함수(`op`)에 적용하여 결과값을 반환합니다.
   * @param fn
   * @param op
   */
  mapOrElse<U>(fn: (error: E) => U, op: (value: T) => U): U;

  /**
   * [`Result<T, E>`]를 [`Result<T, F>`]로 매핑하여 반환합니다.
   * - `Err`이면 내부 값을 함수에 적용하여 [`Result<T, E>`]를 [`Result<T, F>`]로 매핑힙니다.
   * - `Ok`이면 값을 그대로 두고, [`Result<T, F>`]로 매핑합니다.
   * @param op
   */
  mapErr<F>(op: (error: E) => F): Result<T, F>;
}

interface IFunctional<T, E> {
  /**
   * [`Result`]가 `Ok`이면 내부 값으로 함수 `f`를 호출합니다.
   * @param f
   */
  inspect(f: (value: T) => void): Result<T, E>;

  /**
   *[`Result`]가 `Err`이면 내부 값으로 함수 `f`를 호출합니다.
   * @param f
   */
  inspectErr(f: (error: E) => void): Result<T, E>;
}

interface ICircuitEvaluable<T, E> {
  /**
   * [`Result`]가 `Ok`이면 `res`를 반환하고, `Err`이면 `this`를 반환합니다.
   * @param res
   */
  and<U>(res: Result<U, E>): Result<U, E>;

  /**
   * [`Result`]가 `Ok`이면 내부 값으로 함수 `op`를 호출한 결과값을 반환하고, `Err`이면 `this`를 반환합니다.
   * @param op
   */
  andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;

  /**
   * [`Result`]가 `Err`이면 `res`를 반환하고, `Ok`이면 `this`를 반환합니다.
   * @param res
   */
  or<F>(res: Result<T, F>): Result<T, F>;

  /**
   * [`Result`]가 `Err`이면 내부 값으로 함수 `op`를 호출한 결과값을 반환하고, `Ok`이면 `this`를 반환합니다.
   * @param op
   */
  orElse<F>(op: (error: E) => Result<T, F>): Result<T, F>;
}

interface ITransformable<T, E> {
  /**
   * [`Result<T, E>`]를 [`Option<T>`]로 변환합니다.
   * - `Ok(x)`을 `Some(x)`로 매핑
   * - `Err(x)`을 `None`로 매핑
   */
  ok(): Option<T>;

  /**
   * [`Result<T, E>`]를 [`Option<E>`]로 변환합니다.
   * - `Ok(x)`을 `None`로 매핑
   * - `Err(x)`을 `Some(x)`로 매핑
   */
  err(): Option<E>;

  /**
   * [`Result<T, E>`]를 [`Promise<T>`]로 변환합니다.
   * - `Ok(v)`을 `Promise.resolve(v)`로 매핑
   * - `Err(e)`을 `Promise.reject(e)`로 매핑
   */
  promise(): Promise<T>;

  /**
   * [`Result<Option<T>, E>`]를 [`Option<Result<T, E>>`]로 변환합니다.
   * - `Ok(Some(v))`을 `Some(Ok(v))`로 매핑
   * - `OK(None)`을 `None`로 매핑
   * - `Err(e)`을 Some(Err(e))`로 매핑
   */
  transpose(): Option<Result<T, E>>;

  /**
   * [`Result<Promise<T>, E>`]를 [`Promise<Result<T, E>>`]로 변환합니다.
   * - `Ok(Promise.resolve(v))`을 `Promise.resolve(Ok(v))`로 매핑
   * - `Err(e)`을 `Promise.resolve(Err(e))`로 매핑
   */
  transposeAsync(): Promise<Result<T, E>>;
}

interface IComparable<T, E> {
  /**
   * `this`와 `other`의 내부 값이 동등한 지 비교합니다.
   * @param other
   */
  equal(other: Result<T, E>): boolean;
}

export class TOk<T> implements Result<T, any> {
  #inner: T;

  constructor(expr: T) {
    this.#inner = expr;
  }

  isOk(): boolean {
    return true;
  }

  isOkAnd(f: (value: T) => boolean): boolean {
    return f(this.#inner);
  }

  isErr(): boolean {
    return false;
  }

  isErrAnd(f: (error: any) => boolean): boolean {
    return false;
  }

  expect(msg: string): T {
    return this.#inner;
  }

  expectErr(msg: string): never {
    throwUnwrapFailed(msg, this.#inner);
  }

  unwrap(): T {
    return this.#inner;
  }

  unwrapErr(): never {
    throwUnwrapFailed("called `unwrapErr()` on an `Ok` value", this.#inner);
  }

  unwrapOr(value: T): T {
    return this.#inner;
  }

  unwrapOrElse(op: (error: any) => T): T {
    return this.#inner;
  }

  map<U>(op: (value: T) => U): Result<U, any> {
    return Ok(op(this.#inner));
  }

  mapOr<U>(value: U, op: (value: T) => U): U {
    return op(this.#inner);
  }

  mapOrElse<U>(fn: (error: any) => U, op: (value: T) => U): U {
    return op(this.#inner);
  }

  mapErr(op: (error: any) => any): Result<T, any> {
    return Ok(this.#inner);
  }

  inspect(f: (value: T) => void): Result<T, any> {
    f(this.#inner);
    return this;
  }

  inspectErr(f: (error: any) => void): Result<T, any> {
    return this;
  }

  and<U>(res: Result<U, any>): Result<U, any> {
    return res;
  }

  andThen<U>(op: (value: T) => Result<U, any>): Result<U, any> {
    return op(this.#inner);
  }

  or(res: Result<T, any>): Result<T, any> {
    return this;
  }

  orElse(op: (error: any) => Result<T, any>): Result<T, any> {
    return this;
  }

  ok(): Option<T> {
    return Some(this.#inner);
  }

  err(): Option<any> {
    return None;
  }

  promise(): Promise<T> {
    return Promise.resolve(this.#inner);
  }

  transpose(): Option<Result<T, any>> {
    if (this.#inner instanceof TSome) return Some(Ok(this.#inner.unwrap()));
    if (this.#inner === None) return None;
    throwUnreachableUnchecked();
  }

  transposeAsync(): Promise<Result<T, any>> {
    return this.#inner instanceof Promise
      ? this.#inner.then(Ok)
      : throwUnreachableUnchecked();
  }

  equal(other: Result<T, any>): boolean {
    return other instanceof TOk && isEqual(this.#inner, other.unwrap());
  }
}

export class TErr<E> implements Result<any, E> {
  #inner: E;

  constructor(expr: E) {
    this.#inner = expr;
  }

  isOk(): boolean {
    return false;
  }

  isOkAnd(f: (value: any) => boolean): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  isErrAnd(f: (error: E) => boolean): boolean {
    return f(this.#inner);
  }

  expect(msg: string): never {
    throwUnwrapFailed(msg, this.#inner);
  }

  expectErr(msg: string): E {
    return this.#inner;
  }

  unwrap(): never {
    throwUnwrapFailed("called `unwrap()` on an `Err` value", this.#inner);
  }

  unwrapErr(): E {
    return this.#inner;
  }

  unwrapOr<T>(value: T): T {
    return value;
  }

  unwrapOrElse<T>(op: (error: E) => T): T {
    return op(this.#inner);
  }

  map(op: (value: any) => any): Result<any, E> {
    return Err(this.#inner);
  }

  mapOr<U>(value: U, op: (value: any) => U): U {
    return value;
  }

  mapOrElse<U>(fn: (error: E) => U, op: (value: any) => U): U {
    return fn(this.#inner);
  }

  mapErr<F>(op: (error: E) => F): Result<any, F> {
    return Err(op(this.#inner));
  }

  inspect(f: (value: any) => void): Result<any, E> {
    return this;
  }

  inspectErr(f: (error: E) => void): Result<any, E> {
    f(this.#inner);
    return this;
  }

  and(res: Result<any, E>): Result<any, E> {
    return this;
  }

  andThen(op: (value: any) => Result<any, E>): Result<any, E> {
    return this;
  }

  or<F>(res: Result<any, F>): Result<any, F> {
    return res;
  }

  orElse<F>(op: (error: E) => Result<any, F>): Result<any, F> {
    return op(this.#inner);
  }

  ok(): Option<any> {
    return None;
  }

  err(): Option<E> {
    return Some(this.#inner);
  }

  promise(): Promise<any> {
    return Promise.reject(this.#inner);
  }

  transpose(): Option<Result<any, E>> {
    return Some(Err(this.#inner));
  }

  transposeAsync(): Promise<Result<any, E>> {
    return Promise.resolve(Err(this.#inner));
  }

  equal(other: Result<any, E>): boolean {
    return other instanceof TErr && isEqual(this.#inner, other.unwrapErr());
  }
}

/**
 * [`Result<T, E>`] 타입의 Ok 객체를 생성합니다.
 * @param expr
 */
export const Ok = <T, E>(expr: T): Result<T, E> => new TOk(expr);

/**
 * [`Result<T, E>`] 타입의 Err 객체를 생성합니다.
 * @param expr
 */
export const Err = <T, E>(expr: E): Result<T, E> => new TErr(expr);

/**
 * 전역 상에 [`Result<T, E>`] 타입의 객체 생성자들을 초기화합니다.
 */
export const defineResult = (): void => {
  if ("Some" in globalThis || "None" in globalThis) {
    throw new Error();
  }

  Object.defineProperties(globalThis, {
    Ok: {
      value: Ok,
    },
    Err: {
      value: Err,
    },
  });
};
