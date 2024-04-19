# Rusty Container API

Use rust-like optional and error-handling types API.

Some methods are missing because necessity and language specifics.

## Table of Contents

-  [Features](#features)
-  [Usage](#usage)
    - [Intallation](#installation)
    - [Declaring types globally](#declaring-types-globally)
    - [Initializing variants](#initializing-variants)
    - [Defining types](#defining-types)
-  [API](#API)
    - [Option](#option)
    - [Result](#result)
- [Custom Methods](#custom-methods)

## Features

- Rust-like `Option` and `Result` types
- Optional type handling
- Error handling
- Transformable variants
- `Promise` Transformable

## Usage

The code below needs to be written as needed.

아래의 코드는 필요시 직접 작성하세요.

### Installation

```sh
$ pnpm add @bya2/rusty-container-api
```

### Declaring types globally

This code can cause type conflicts, so you'll need to create and insert your own `.d.ts` file.

```ts
export declare global {
  type Option<T> = import("@bya2/rusty-container-api").Option<T>;
  function Some<T>(expr: T): Option<T>;
  const None: Option<any>; // or const None<T>: Option<T>

  type Result<T, E> = import("@bya2/rusty-container-api").Result<T, E>;
  function Ok<T, E>(expr: T): Result<T, E>;
  function Err<T, E>(expr: E): Result<T, E>;
}
```

### Initializing variants

And write that code in your setup file(`.js`), then import it at the top of your entry point.

```js
import { defineOption, defineResult } from "@bya2/rusty-container-api";
defineOption(); // optional
defineResult(); // optional
```

### Defining types

```ts
const a = Some(1) // Option<number>;
const b = None // Option<any>;
const c: Option<number> = None;

const d = Ok(1); // Result<number, unknown>
const e = Err("a"); // Result<unknown, string>
const f: Result<number, Error> = Ok(1);
const g = Err<number, Error>(new Error());
```


## API

### Option

- Variants: `Some`, `None`
- [Code](./src/Option.ts)
- [Test](./src/Option.test.ts)


### Result

- Variants: `Ok`, `Err`
- [Code](./src/Result.ts)
- [Test](./src/Result.test.ts)


## Custom Methods

### Option Interface

- [x] resolveOr
- [x] resolveOrElse
- [x] transposeAsync
- [x] equal


### Result Interface

- [x] promise
- [x] transposeAsync
- [x] equal

## Reference

- [Option](https://doc.rust-lang.org/src/core/option.rs.html)
- [Result](https://doc.rust-lang.org/src/core/result.rs.html)