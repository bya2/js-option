import { Result, Success, Failure, Ok, Err } from "./Result";
import { unwrapFailed, unreachableUnchecked, expectFailed } from "./error";

export interface Option<T> {
  /**
   * 옵션이 [`Some`] 값인 경우 `true`를 반환합니다.
   */
  isSome(): this is SomeType<T>;

  /**
   * 옵션이 [`Some`]이고 그 안의 값이 '술어'와 일치하는 경우 `true`를 반환합니다.
   * @param f
   */
  isSomeAnd(f: (value: T) => boolean): boolean;

  /**
   * 옵션이 [`None`] 값인 경우 `true`를 반환합니다.
   */
  isNone(): this is NoneType;

  /**
   * 포함된 [`Some`] 값을 반환합니다.
   * 사용자 지정 오류 메시지 `msg`와 함께 [`None`]이면 오류 처리합니다.
   * @param msg
   */
  expect(msg: string): T;

  /**
   * 포함된 [`Some`] 값을 반환합니다.
   * [`None`]이면 오류 처리합니다.
   */
  unwrap(): T;

  /**
   * 포함된 [`Some`] 값 또는 제공된 기본값을 반환합니다.
   * @param value
   */
  unwrapOr(value: T): T;

  /**
   * 포함된 [`Some`] 값을 반환하거나 콜백 함수에서 계산합니다.
   * @param f
   */
  unwrapOrElse(f: () => T): T;

  /**
   * 값이 [`None`]가 아닌지 확인하지 않고, [`Some`] 값을 반환합니다.
   */
  unwrapUnchecked(): T;

  /**
   * 포함된 값에 함수를 적용하여 `Option<T>`를 `Option<U>`에 매핑하거나(`Some`인 경우), `None`을 반환합니다(`None`인 경우).
   * @param op
   */
  map<U>(op: (value: T) => U): Option<U>;

  /**
   * 포함된 값에 대한 참조를 사용하여 제공된 클로저를 호출합니다([`Some`] 경우).
   * @param f
   */
  inspect(f: (value: T) => void): this;

  /**
   * 제공된 기본 결과(None)를 반환하거나 포함된 값(Some)에 함수를 적용합니다.
   * @param value
   * @param op
   */
  mapOr<U>(value: U, op: (value: T) => U): U;

  /**
   * 기본 함수 결과(None)를 계산하거나 포함된 값(Some)에 다른 함수를 적용합니다.
   * @param fn
   * @param op
   */
  mapOrElse<U>(fn: () => U, op: (value: T) => U): U;

  /**
   * `Option<T>`를 [`Result<T, E>`]로 변환하여 [`Some(v)`]를 [`Ok(v)`]로, [`None`]을 [`Err(err)`]로 매핑합니다.
   * @param err
   */
  okOr<E>(err: E): Result<T, E>;

  /**
   * Option<T>`를 [`Result<T, E>`]로 변환하여 [`Some(v)`]를 [`Ok(v)`]로, [`None`]을 [`Err(err())`]로 매핑합니다.
   * @param err
   */
  okOrElse<E>(err: () => E): Result<T, E>;

  /**
   * 옵션이 [`None`]이면 [`None`]을 반환하고, 그렇지 않으면 `optb`를 반환합니다.
   * @param optb
   */
  and<O extends Option<any>>(optb: O): O | this;

  /**
   * 옵션이 [`None`]이면 [`None`]을 반환하고, 그렇지 않으면 래핑된 값으로 `f`를 호출하고 결과를 반환합니다.
   * @param f
   */
  andThen<O extends Option<any>>(f: (value: T) => O): O | this;

  /**
   * 옵션이 [`None`]이면 [`None`]을 반환하고, 그렇지 않으면 래핑된 값으로 `predicate`를 호출하고 반환합니다.
   * @param predicate
   */
  filter(predicate: (value: T) => boolean): Option<T>;

  /**
   * 옵션에 값이 포함되어 있으면 `this`을 반환하고, 그렇지 않으면 `optb`를 반환합니다.
   * @param optb
   */
  or<O extends Option<any>>(optb: O): this | O;

  /**
   * 옵션에 값이 포함되어 있으면 `this`을 반환하고, 그렇지 않으면 `f`를 호출하여 결과를 반환합니다.
   * @param f
   */
  orElse<O extends Option<any>>(f: () => O): this | O;

  /**
   * `this`, `optb` 중 정확히 하나가 [`Some`]이면 [`Some`]를 반환하고, 그렇지 않으면 [`None`]을 반환합니다.
   * @param optb
   */
  xor<O extends Option<any>>(optb: O): this | O | NoneType;

  /**
   * 다른 `Option`으로 `this`을 압축합니다.
   *
   * `this`가 `Some(s)`이고 `other`가 `Some(o)`인 경우, 이 메서드는 `Some<[s, o]>`을 반환합니다.
   * 그렇지 않으면 `None`이 반환됩니다.
   * @param other
   */
  zip<U>(other: Option<U>): Option<[T, U]>;

  /**
   * `this`와 다른 `Option`을 `f` 함수로 압축합니다.
   *
   * `this`가 `Some(s)`이고 `other`가 `Some(o)`인 경우, 이 메서드는 `Some<f(s, o)>`를 반환합니다.
   * 그렇지 않으면 `None`이 반환됩니다.
   * @param ohter
   * @param f
   */
  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R>;

  /**
   * [`Result`]의 `Option`을 `Option`의 [`Result`]로 변환합니다.
   */
  transpose<E>(): Result<Option<T>, E>;
}

export class SomeType<T> implements Option<T> {
  private inner: T;

  private constructor(value: T) {
    this.inner = value;
  }

  static Some<T>(value: T): SomeType<T> {
    return new SomeType(value);
  }

  public isSome(): this is SomeType<T>;
  public isSome(): true {
    return true;
  }

  public isSomeAnd(f: (value: T) => boolean): boolean {
    return f(this.inner);
  }

  public isNone(): false {
    return false;
  }

  public expect(msg: string): T {
    return this.inner;
  }

  public unwrap(): T {
    return this.inner;
  }

  public unwrapOr(value: T): T {
    return this.inner;
  }

  public unwrapOrElse(f: () => T): T {
    return this.inner;
  }

  public unwrapUnchecked(): T {
    return this.inner;
  }

  public map<U>(op: (value: T) => U): SomeType<U> {
    return Some(op(this.inner));
  }

  public inspect(f: (value: T) => void): this {
    f(this.inner);
    return this;
  }

  public mapOr<U>(value: U, op: (value: T) => U): U {
    return op(this.inner);
  }

  public mapOrElse<U>(fn: () => U, op: (value: T) => U): U {
    return op(this.inner);
  }

  public okOr<E>(err: E): Success<T> {
    return Ok(this.inner);
  }

  public okOrElse<E>(err: () => E): Success<T> {
    return Ok(this.inner);
  }

  public and<O extends Option<any>>(optb: O): O {
    return optb;
  }

  public andThen<O extends Option<any>>(f: (value: T) => O): O {
    return f(this.inner);
  }

  public filter(predicate: (value: T) => boolean): this | NoneType {
    if (predicate(this.inner)) return this;
    return None;
  }

  public or<O extends Option<any>>(optb: O): this {
    return this;
  }

  public orElse<O extends Option<any>>(f: () => O): this {
    return this;
  }

  public xor<U>(optb: SomeType<U>): NoneType;
  public xor(optb: NoneType): this;
  public xor<O extends Option<any>>(optb: O): this | NoneType {
    return optb.isNone() ? this : None;
  }

  public zip<U>(other: SomeType<U>): SomeType<[T, U]>;
  public zip<U>(other: NoneType): NoneType;
  public zip<U>(other: Option<U>): Option<[T, U]> {
    return other.isSome() ? Some([this.inner, other.unwrap()] as [T, U]) : None;
  }

  public zipWith<U, R>(other: SomeType<U>, f: (t: T, u: U) => R): SomeType<R>;
  public zipWith<U, R>(other: NoneType, f: (t: T, u: any) => any): NoneType;
  public zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R> {
    return other.isSome() ? Some(f(this.inner, other.unwrap())) : None;
  }

  public transpose<E>(): Result<SomeType<T>, E> {
    if (this.inner instanceof Success) return Ok(Some(this.inner.unwrap()));
    if (this.inner instanceof Failure) return this.inner;
    unreachableUnchecked();
  }
}

export class NoneType implements Option<never> {
  private constructor() {}

  static None = new this();

  public isSome(): false {
    return false;
  }

  public isSomeAnd(f: (value: never) => boolean): false {
    return false;
  }

  public isNone(): this is NoneType;
  public isNone(): true {
    return true;
  }

  public expect(msg: string): never {
    expectFailed(msg);
  }

  public unwrap(): never {
    unwrapFailed("called `unwrap()` on a `None` value");
  }

  public unwrapOr<T>(value: T): T {
    return value;
  }

  public unwrapOrElse<T>(f: () => T): T {
    return f();
  }

  public unwrapUnchecked(): never {
    unreachableUnchecked();
  }

  public map<U>(op: (value: never) => U): NoneType {
    return None;
  }

  public inspect(f: (value: never) => void): this {
    return this;
  }

  public mapOr<U>(value: U, op: (value: never) => U): U {
    return value;
  }

  public mapOrElse<U>(fn: () => U, op: (value: never) => U): U {
    return fn();
  }

  public okOr<E>(err: E): Failure<E> {
    return Err(err);
  }

  public okOrElse<E>(err: () => E): Failure<E> {
    return Err(err());
  }

  public and<O extends Option<any>>(optb: O): this {
    return this;
  }

  public andThen<O extends Option<any>>(f: (value: never) => O): this {
    return this;
  }

  public filter(predicate: (value: never) => boolean): NoneType {
    return None;
  }

  public or<O extends Option<any>>(optb: O): O {
    return optb;
  }

  public orElse<O extends Option<any>>(f: () => O): O {
    return f();
  }

  public xor<U>(optb: SomeType<U>): SomeType<U>;
  public xor(optb: NoneType): NoneType;
  public xor<O extends Option<any>>(optb: O): O | NoneType {
    return optb.isSome() ? optb : None;
  }

  public zip(other: Option<any>): NoneType {
    return None;
  }

  public zipWith(other: Option<any>, f: (t: never, u: any) => any): NoneType {
    return None;
  }

  public transpose<E>(): Result<NoneType, E> {
    return Ok(None);
  }
}

export const Some = SomeType.Some;

export const None = NoneType.None;
