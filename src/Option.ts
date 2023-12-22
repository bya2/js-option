import { Result, ResultOk, ResultErr, Ok, Err } from "./Result";
import { compare } from "./utils";
import { UnwrapFailed, UnreachableCodeExecuted } from "./error";

export interface Option<T> {
  isSome(): boolean;

  isNone(): boolean;

  expect(msg: string): T;

  unwrap(): T;

  unwrapOr(value: T): T;

  unwrapOrElse(callbackFn: () => T): T;

  unwrapUnchecked(): T;

  inspect(fn: (value: T) => void): this;

  map<U>(callbackFn: (value: T) => U): Option<U>;

  mapOr<U>(value: U, callbackFn: (value: T) => U): U;

  mapOrElse<U>(fn: () => U, callbackFn: (value: T) => U): U;

  okOr<E>(err: E): Result<T, E>;

  okOrElse<E>(err: () => E): Result<T, E>;

  and<U>(optb: Option<U>): Option<U>;

  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  filter(predicate: (value: T) => boolean): Option<T>;

  or(optb: Option<T>): Option<T>;

  orElse(f: () => Option<T>): Option<T>;

  xor(optb: Option<T>): Option<T>;

  insert(value: T): T;

  getOrInsert(value: T): T;

  getOrInsertWith(f: () => T): T;

  zip<U>(other: Option<U>): Option<[T, U]>;

  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R>;

  transpose<E>(): Result<Option<T>, E>;

  equal(other: Option<T>, deep?: boolean): boolean;
}

export class OptionSome<T> implements Option<T> {
  protected inner: T;

  constructor(value: T) {
    this.inner = value;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }

  expect(msg: string): T {
    return this.inner;
  }

  unwrap(): T {
    return this.inner;
  }

  unwrapOr(value: T): T {
    return this.inner;
  }

  unwrapOrElse(callbackFn: () => T): T {
    return this.inner;
  }

  unwrapUnchecked(): T {
    console.assert(this.isSome());
    return this.inner;
  }

  inspect(fn: (value: T) => void): this {
    fn(this.inner);
    return this;
  }

  map<U>(cb: (value: T) => U): Option<U> {
    return Some(cb(this.inner));
  }

  mapOr<U = T>(value: U, cb: (value: T) => U): U {
    return cb(this.inner);
  }

  mapOrElse<U>(fn: () => U, cb: (value: T) => U): U {
    return cb(this.inner);
  }

  okOr<E>(err: E): Result<T, E> {
    return Ok(this.inner);
  }

  okOrElse<E>(err: () => E): Result<T, E> {
    return Ok(this.inner);
  }

  and<U>(optb: Option<U>): Option<U> {
    return optb;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.inner);
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    if (predicate(this.inner)) {
      return this;
    }
    return None;
  }

  or(optb: Option<T>): Option<T> {
    return this;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return this;
  }

  xor(optb: Option<T>): Option<T> {
    return optb.isNone() ? this : None;
  }

  insert(value: T): T {
    return Some(value).unwrapUnchecked();
  }

  getOrInsert(value: T): T {
    return this.unwrapUnchecked();
  }

  getOrInsertWith(f: () => T): T {
    return this.unwrapUnchecked();
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return other.isSome() ? Some([this.inner, other.unwrap()]) : None;
  }

  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R> {
    return other.isSome() ? Some(f(this.inner, other.unwrap())) : None;
  }

  transpose<E>(): Result<Option<T>, E> {
    if (this.inner instanceof ResultOk) return Ok(this.inner.unwrap());
    if (this.inner instanceof ResultErr) return Err(this.inner.unwrapErr());

    UnreachableCodeExecuted();
  }

  equal(other: Option<T>, deep: boolean = false): boolean {
    return other.isSome() && compare(this.inner, other.unwrap(), deep);
  }
}

export class OptionNone<T = any> implements Option<T> {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  expect(msg: string): T {
    UnwrapFailed(msg);
  }

  unwrap(): T {
    UnwrapFailed("called `Option.prototype.unwrap()` on a `None` value");
  }

  unwrapOr(value: T): T {
    return value;
  }

  unwrapOrElse(callbackFn: () => T): T {
    return callbackFn();
  }

  unwrapUnchecked(): T {
    console.assert(this.isSome());
    UnreachableCodeExecuted();
  }

  inspect(fn: (value: T) => void): this {
    return this;
  }

  map<U>(callbackFn: (value: T) => U): Option<U> {
    return None;
  }

  mapOr<U>(value: U, _: (value: T) => U): U {
    return value;
  }

  mapOrElse<U>(fn: () => U, callbackFn: (value: T) => U): U {
    return fn();
  }

  okOr<E>(err: E): Result<T, E> {
    return Err(err);
  }

  okOrElse<E>(err: () => E): Result<T, E> {
    return Err(err());
  }

  and<U>(optb: Option<U>): Option<U> {
    return None;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return None;
  }

  filter(predicate: (value: T) => boolean): Option<T> {
    return None;
  }

  or(optb: Option<T>): Option<T> {
    return optb;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  xor(optb: Option<T>): Option<T> {
    return optb.isSome() ? optb : None;
  }

  insert(value: T): T {
    return Some(value).unwrapUnchecked();
  }

  getOrInsert(value: T): T {
    return Some(value).unwrapUnchecked();
  }

  getOrInsertWith(f: () => T): T {
    return Some(f()).unwrapUnchecked();
  }

  zip<U>(other: Option<U>): Option<[T, U]> {
    return None;
  }

  zipWith<U, R>(other: Option<U>, f: (t: T, u: U) => R): Option<R> {
    return None;
  }

  transpose<E>(): Result<Option<T>, E> {
    return Ok(None);
  }

  equal(other: Option<T>, deep: boolean): boolean {
    return other.isNone();
  }
}

export const Some = <T>(value: T): Option<T> => new OptionSome(value);

export const None = new OptionNone();
