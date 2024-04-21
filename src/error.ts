interface IErrorOptions {
  type?: string;
  message?: string;
  cause?: unknown;
  label?: string;
}

const angled = (input?: string) => (input ? `(${input})` : "");
const squared = (input?: string) => (input ? `[${input}]` : "");

class CustomError extends Error {
  constructor({ type, message, cause, label }: IErrorOptions = {}) {
    super(message, cause ?? { cause });
    this.name = `${squared(label)} ${this.constructor.name}${angled(type)}`;
  }
}

export class FailureError extends CustomError {
  /**
   * `expect` 함수나 메서드가 실패했음을 알리는 에러 객체를 반환합니다.
   * @param message
   */
  static expectFailed(message: string): Error {
    return new FailureError({
      type: "Expect failed",
      message,
    });
  }

  /**
   * `unwrap` 함수나 메서드가 실패했음을 알리는 에러 객체를 반환합니다.
   * @param message
   * @param error
   */
  static unwrapFailed<E>(message: string, error?: E): Error {
    return new FailureError({
      type: "Unwrap failed",
      message,
      cause: error,
    });
  }

  /**
   * 어떤 변수나 프로퍼티에 바인딩이 실패했음을 알리는 에러 객체를 반환합니다.
   * @param message
   */
  static bindingFailed(message: string): Error {
    return new FailureError({
      type: "Binding failed",
      message,
    });
  }
}

export class UnreachableCodeError extends CustomError {
  /**
   * 선택하지 않았을 때, 해당 코드가 도달할 수 없는 지점임을 알리는 에러 객체를 반환합니다.
   * @param message
   * @returns
   */
  static variantUnchecked(message?: string): Error {
    return new UnreachableCodeError({
      type: "Variant unchecked",
      message: message || "`variantUnchecked()` must never be reached.",
    });
  }

  static typeUnchecked(message?: string): Error {
    return new UnreachableCodeError({
      type: "Type unchecked",
      message: message || "`typeUnchecked()` must never be reached.",
    });
  }
}

// export class A extends LabeledError {
//   static a(message?: string): Error {
//     return new A({
//       name:""
//       message: message || "This method can only be used when the inner value is a Promise object."
//     })
//   }
// }
