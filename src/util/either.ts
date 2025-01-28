export type Either<L, R> = Left<L> | Right<R>
export type Left<L> = { $: 'left', left: L }
export const Left = <L>(left: L): Left<L> => ({ $: 'left', left });
export const isLeft = <L>(either: Either<L, unknown>): either is Left<L> => either.$ === 'left';
export type Right<R> = { $: 'right', right: R }
export const Right = <R>(right: R): Right<R> => ({ $: 'right', right });
export const isRight = <R>(either: Either<unknown, R>): either is Left<R> => either.$ === 'right';
