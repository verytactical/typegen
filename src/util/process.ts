import { Unwrap } from "./tricks";

export interface Async<Result, Context> extends AsyncGenerator<never, Result, Context> {}
export type GetAsyncResult<T> = T extends Async<infer R, infer C> ? R : never
export type GetAsyncEffect<G> = [G] extends [Async<infer T, infer E>] ? Unwrap<E> : never
export type GetAsyncEffectOf<F> = F extends (...args: never[]) => infer R ? GetAsyncEffect<R> : never

export interface Sync<Result, Context> extends Generator<never, Result, Context> {}
export type GetSyncResult<T> = T extends Sync<infer R, infer C> ? R : never
export type GetSyncEffect<G> = [G] extends [Sync<infer T, infer E>] ? Unwrap<E> : never
export type GetSyncEffectOf<F> = F extends (...args: never[]) => infer R ? GetSyncEffect<R> : never

export const define = <F extends (...args: never[]) => unknown>() => <K extends string>(key: K) => {
    return function* (...args: Parameters<F>): Sync<ReturnType<F>, { readonly [L in K]: F }> {
        // @ts-ignore
        return yield* (yield 42)[key](...args);
    };
};
type EffsOf<H> = [H] extends [never] ? {} : H
type ToEffSync<U> = Unwrap<{
    readonly [K in keyof U]: U[K] extends (...args: infer A) => infer R ? (...args: A) => Sync<R, never> : never
}>
export const handleSync = <A extends any[], T, U, const H>(
    fn: (...args: A) => Sync<T, U>,
    handlers: ToEffSync<U> extends H ? Readonly<H & Partial<ToEffSync<U>>> : ToEffSync<U>
) => {
    return function*(...args: A): Sync<T, Unwrap<Omit<U, keyof H> & EffsOf<GetSyncEffectOf<H[keyof H]>>>> {
        const gen = fn(...args);
        for (; ;) {
            const res = gen.next({ ...(yield 42 as never), ...handlers } as any);
            if (res.done) return res.value;
        }
    };
};
type ToEffAsync<U> = Unwrap<{
    readonly [K in keyof U]: U[K] extends (...args: infer A) => infer R ? (...args: A) => Sync<R, never> : never
}>
export const handleAsync = <A extends any[], T, U, const H>(
    fn: (...args: A) => Async<T, U>,
    handlers: ToEffAsync<U> extends H ? Readonly<H & Partial<ToEffAsync<U>>> : ToEffAsync<U>
) => {
    return async function* (...args: A): Async<T, Unwrap<Omit<U, keyof H> & EffsOf<GetAsyncEffectOf<H[keyof H]>>>> {
        const gen = fn(...args);
        for (; ;) {
            const res = await gen.next({ ...(yield 42 as never), ...handlers } as any);
            if (res.done) return res.value;
        }
    };
};
export function runSync<T, U>(fn: () => {} extends U ? Sync<T, U> : Sync<T, Record<string, never>>): T {
    const gen = fn();
    for (; ;) {
        const res = gen.next({} as any);
        if (res.done) return res.value;
    }
};
export async function runAsync<T, U>(fn: () => {} extends U ? Async<T, U> : Async<T, Record<string, never>>): Promise<T> {
    const gen = fn();
    for (; ;) {
        const res = await gen.next({} as any);
        if (res.done) return res.value;
    }
};

export const contextColor = define<(text: string) => string>()('contextColor');
export interface ContextColor extends GetSyncEffectOf<typeof contextColor> {}
export const errorColor = define<(text: string) => string>()('errorColor');
export interface ErrorColor extends GetSyncEffectOf<typeof errorColor> {}
export const sourceColor = define<(text: string) => string>()('sourceColor');
export interface SourceColor extends GetSyncEffectOf<typeof sourceColor> {}
export type Colors = ContextColor & ErrorColor & SourceColor

export const err = define<(text: string) => void>()('err');
export interface Err extends GetSyncEffectOf<typeof err> {}
export const warn = define<(text: string) => void>()('warn');
export interface Warn extends GetSyncEffectOf<typeof warn> {}
export const info = define<(text: string) => void>()('info');
export interface Info extends GetSyncEffectOf<typeof info> {}
export type Log = Err & Warn & Info & Colors

/**
 * NB! Only to be used at top-level of application
 * 
 * If there was an accidental thrown error (due to compiler bug),
 * report it as the rest of the errors
 * 
 * Makes process return undefined in case of a failure
 */
export const catchInternalErrorsSync = <A extends any[], R, C>(fn: (...args: A) => Sync<R, C>) => {
    return function* (...args: A): Sync<R | undefined, C & Err> {
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
export const catchInternalErrorsAsync = <A extends any[], R, C>(fn: (...args: A) => Async<R, C>) => {
    return async function* (...args: A): Async<R | undefined, C & Err> {
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
// export function runSync<T>(fn: () => Sync<T, {}>): Either<LogEntry[], T> {
//     const gen = fn();
//     const log: LogEntry[] = [];
//     for (;;) {
//         const res = gen.next();
//         if (!res.done) {
//             log.push(res.value);
//             continue;
//         }
//         if (typeof log.find(entry => isError(entry)) !== 'undefined') {
//             return Left(log);
//         } else {
//             return Right(res.value);
//         }
//     }
// };

/**
 * Run async process and collect the log
 */
// export async function runAsync<T, C>(
//     fn: () => Async<T, C>, 
//     onLog: (entry: LogEntry) => void
// ): Promise<T | undefined> {
//     const gen = fn();
//     for (;;) {
//         const res = await gen.next();
//         if (res.done) {
//             return res.value
//         } else {
//             onLog(res.value);
//         }
//     }
// };

/**
 * Run process on every element of an array
 */
export function* traverse<T, U, C>(
    values: readonly T[],
    fn: (u: T) => Sync<U, C>
): Sync<U[], C> {
    const result: U[] = [];
    for (const value of values) {
        result.push(yield* fn(value));
    }
    return result;
}