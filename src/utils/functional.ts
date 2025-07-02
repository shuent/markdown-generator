// Functional utilities for better error handling and composition

export type Result<T, E = Error> =
  | {
      readonly success: true;
      readonly data: T;
    }
  | {
      readonly success: false;
      readonly error: E;
    };

export const success = <T>(data: T): Result<T> => ({
  success: true,
  data,
});

export const failure = <E = Error>(error: E): Result<never, E> => ({
  success: false,
  error,
});

export const tryCatch = <T>(fn: () => T | Promise<T>): Promise<Result<T>> =>
  Promise.resolve(fn())
    .then((data) => success(data))
    .catch((error) => failure(error instanceof Error ? error : new Error(String(error))));

export const asyncTryCatch = async <T>(fn: () => Promise<T>): Promise<Result<T>> => tryCatch(fn);

export const map = <T, U>(result: Result<T>, fn: (data: T) => U): Result<U> =>
  result.success ? success(fn(result.data)) : result;

export const flatMap = <T, U>(result: Result<T>, fn: (data: T) => Result<U>): Result<U> =>
  result.success ? fn(result.data) : result;

export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> =>
  result.success ? result : failure(fn(result.error));

export const fold = <T, E, U>(
  result: Result<T, E>,
  onSuccess: (data: T) => U,
  onFailure: (error: E) => U,
): U => (result.success ? onSuccess(result.data) : onFailure(result.error));

export const getOrElse = <T>(result: Result<T>, defaultValue: T): T =>
  result.success ? result.data : defaultValue;

export const getOrThrow = <T>(result: Result<T>): T => {
  if (result.success) return result.data;
  throw result.error;
};

// Pipeline utilities
export const pipe = <T, U>(value: T, fn: (value: T) => U): U => fn(value);

export const compose =
  <T>(...fns: Array<(value: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value);

// CLI specific error handling
export const handleCliError = (error: unknown): never => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Error:', message);
  process.exit(1);
};

export const safeCliAction =
  <Args extends any[], T>(action: (...args: Args) => Promise<T>) =>
  async (...args: Args): Promise<void> => {
    const result = await asyncTryCatch(() => action(...args));
    fold(result, () => {}, handleCliError);
  };
