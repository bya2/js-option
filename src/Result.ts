import { Option, OptionSome, OptionNone, Some, None } from "./Option";
import { UnwrapFailed, UnreachableCodeExecuted } from "./error";

export interface Result<T, E> {
  isOk(): boolean;

  isOkAnd(f: (arg: T) => boolean): boolean;

  isErr(): boolean;

  isErrAnd(f: (arg: E) => boolean): boolean;

  ok(): Option<T>;

  err(): Option<E>;

  map<U>(cb: (arg: T) => U): Result<U, E>;

  mapOr<U>(value: U, cb: (arg: T) => U): U;

  mapOrElse<U>(fn: (err: E) => U, cb: (arg: T) => U): U;

  mapErr<F>(op: (arg: E) => F): Result<T, F>;

  inspect(f: (arg: T) => void): this;

  inspectErr(f: (err: E) => void): this;

  expect(msg: string): T;

  expectErr(msg: string): E;

  unwrap(): T;

  unwrapOr(arg: T): T;

  unwrapOrElse(op: (e: E) => T): T;

  unwrapErr(): E;

  unwrapUnchecked(): T;

  unwrapErrUnchecked(): E;

  and<U>(res: Result<U, E>): Result<U, E>;

  andThen<U>(op: (arg: T) => Result<U, E>): Result<U, E>;

  or<F>(res: Result<T, F>): Result<T, F>;

  orElse<F>(op: (e: E) => Result<T, F>): Result<T, F>;

  copied(): Result<T, E>;

  transpose(): Option<Result<T, E>>;
}

export class ResultOk<T, E> implements Result<T, E> {
  protected inner: T;

  constructor(value: T) {
    this.inner = value;
  }

  isOk(): boolean {
    return true;
  }

  isOkAnd(f: (arg: T) => boolean): boolean {
    return f(this.inner);
  }

  isErr(): boolean {
    return false;
  }

  isErrAnd(f: (arg: E) => boolean): boolean {
    return false;
  }

  ok(): Option<T> {
    return Some(this.inner);
  }

  err(): Option<E> {
    return None;
  }

  map<U>(cb: (arg: T) => U): Result<U, E> {
    return Ok(cb(this.inner));
  }

  mapOr<U>(value: U, cb: (arg: T) => U): U {
    return cb(this.inner);
  }

  mapOrElse<U>(fn: (err: E) => U, cb: (arg: T) => U): U {
    return cb(this.inner);
  }

  mapErr<F>(op: (arg: E) => F): Result<T, F> {
    return Ok(this.inner);
  }

  inspect(f: (arg: T) => void): this {
    f(this.inner);
    return this;
  }

  inspectErr(f: (err: E) => void): this {
    return this;
  }

  expect(msg: string): T {
    return this.inner;
  }

  expectErr(msg: string): E {
    UnwrapFailed(msg, this.inner);
  }

  unwrap(): T {
    return this.inner;
  }

  unwrapOr(arg: T): T {
    return this.inner;
  }

  unwrapOrElse(op: (e: E) => T): T {
    return this.inner;
  }

  unwrapErr(): E {
    UnwrapFailed("called `Result.prototype.unwrapErr()` on an `Ok` value", this.inner);
  }

  unwrapUnchecked(): T {
    console.assert(this.isOk());
    return this.inner;
  }

  unwrapErrUnchecked(): E {
    console.assert(this.isErr());
    UnreachableCodeExecuted();
  }

  and<U>(res: Result<U, E>): Result<U, E> {
    return res;
  }

  andThen<U>(op: (arg: T) => Result<U, E>): Result<U, E> {
    return op(this.inner);
  }

  or<F>(res: Result<T, F>): Result<T, any> {
    // return Ok(this.inner);
    return this;
  }

  orElse<F>(op: (e: E) => Result<T, F>): Result<T, F> {
    return Ok(this.inner);
  }

  copied(): Result<T, E> {
    return this.map(t => t);
  }

  transpose(): Option<Result<T, E>> {
    if (this.inner instanceof OptionSome) return Some(Ok(this.inner.unwrap()));
    if (this.inner instanceof OptionNone) return None;
    UnreachableCodeExecuted();
  }
}

export class ResultErr<T, E> implements Result<T, E> {
  protected inner;

  constructor(error: E) {
    this.inner = error;
  }

  isOk(): boolean {
    return false;
  }

  isOkAnd(f: (arg: T) => boolean): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  isErrAnd(f: (arg: E) => boolean): boolean {
    return f(this.inner);
  }

  ok(): Option<T> {
    return None;
  }

  err(): Option<E> {
    return Some(this.inner);
  }

  map<U>(cb: (arg: T) => U): Result<U, E> {
    return Err(this.inner);
  }

  mapOr<U>(value: U, cb: (arg: T) => U): U {
    return value;
  }

  mapOrElse<U>(fn: (err: E) => U, cb: (arg: T) => U): U {
    return fn(this.inner);
  }

  mapErr<F>(op: (arg: E) => F): Result<T, F> {
    return Err(op(this.inner));
  }

  inspect(f: (arg: T) => void): this {
    return this;
  }

  inspectErr(f: (err: E) => void): this {
    f(this.inner);
    return this;
  }

  expect(msg: string): T {
    UnwrapFailed(msg, this.inner);
  }

  expectErr(msg: string): E {
    return this.inner;
  }

  unwrap(): T {
    UnwrapFailed("called `ResultErr.prototype.unwrap()` on an `Err` value", this.inner);
  }

  unwrapOr(arg: T): T {
    return arg;
  }

  unwrapOrElse(op: (e: E) => T): T {
    return op(this.inner);
  }

  unwrapErr(): E {
    return this.inner;
  }

  unwrapUnchecked(): T {
    console.assert(this.isOk());
    UnreachableCodeExecuted();
  }

  unwrapErrUnchecked(): E {
    console.assert(this.isErr());
    return this.inner;
  }

  and(_: Result<any, E>): Result<any, E> {
    return this;
  }

  andThen(op: (arg: T) => Result<any, E>): Result<any, E> {
    return this;
  }

  or<F>(res: Result<T, F>): Result<T, F> {
    return res;
  }

  orElse<F>(op: (e: E) => Result<T, F>): Result<T, F> {
    return op(this.inner);
  }

  copied(): Result<T, E> {
    return this.map(e => e);
  }

  transpose(): Option<Result<T, E>> {
    return Some(Err(this.inner));
  }
}

export const Ok = <T>(value: T): Result<T, any> => new ResultOk(value);

export const Err = <E>(error: E): Result<any, E> => new ResultErr(error);
