import { Either, Left, Right } from "./either";
import { isError, LogEntry, LogError, LogWarn } from "./log";

export type Async<T> = AsyncGenerator<LogEntry, T, unknown>
export type Sync<T> = Generator<LogEntry, T, unknown>
export function* err(text: string): Sync<undefined> { yield LogError(text); }
export function* warn(text: string): Sync<undefined> { yield LogWarn(text); }

/**
 * NB! Only to be used at top-level of application
 * 
 * If there was an accidental thrown error (due to compiler bug),
 * report it as the rest of the errors
 * 
 * Makes process return undefined in case of a failure
 */
export const catchInternalErrorsSync = <A extends any[], R>(fn: (...args: A) => Sync<R>) => {
    return function* (...args: A): Sync<R | undefined> {
        try {
            return yield* fn(...args);
        } catch (error) {
            const message = error instanceof Error ? error.toString() : String(error);
            yield* err(`Bug! ${message}`);
            return undefined;
        }
    };
};

/**
 * NB! Only to be used at top-level of application
 * 
 * If there was an accidental thrown error (due to compiler bug),
 * report it as the rest of the errors
 * 
 * Makes process return undefined in case of a failure
 */
export const catchInternalErrorsAsync = <A extends any[], R>(fn: (...args: A) => Async<R>) => {
    return async function* (...args: A): Async<R | undefined> {
        try {
            return yield* fn(...args);
        } catch (error) {
            const message = error instanceof Error ? error.toString() : String(error);
            yield* err(`Bug! ${message}`);
            return undefined;
        }
    };
};

/**
 * Run sync process and collect the log
 */
export function runSync<T>(fn: () => Sync<T>): Either<LogEntry[], T> {
    const gen = fn();
    const log: LogEntry[] = [];
    for (;;) {
        const res = gen.next();
        if (!res.done) {
            log.push(res.value);
            continue;
        }
        if (typeof log.find(entry => isError(entry)) !== 'undefined') {
            return Left(log);
        } else {
            return Right(res.value);
        }
    }
};

/**
 * Run async process and collect the log
 */
export async function runAsync<T>(fn: () => Async<T>): Promise<Either<LogEntry[], T>> {
    const gen = fn();
    const log: LogEntry[] = [];
    for (;;) {
        const res = await gen.next();
        if (!res.done) {
            log.push(res.value);
            continue;
        }
        if (typeof log.find(entry => isError(entry)) !== 'undefined') {
            return Left(log);
        } else {
            return Right(res.value);
        }
    }
};

/**
 * Run process on every element of an array
 */
export function* map<T, U>(values: T[], fn: (u: T) => Sync<U>): Sync<U[]> {
    const result: U[] = [];
    for (const value of values) {
        result.push(yield* fn(value));
    }
    return result;
}