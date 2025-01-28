import { parse, ParserOptions } from "@babel/parser";
import { err, Sync } from "../util/process";
import * as t from "@babel/types";

export function* parseTypeScript(source: string): Sync<t.File | undefined> {
    const options: ParserOptions = {
        sourceType: "module",
        plugins: ["typescript"],
        errorRecovery: true,
    };
    try {
        const ast = parse(source, options);
        if (ast.errors.length !== 0) {
            for (const error of ast.errors) {
                yield* decodeError(error);
            }
        }
        return ast;
    } catch (error) {
        if (error instanceof SyntaxError) {
            yield* decodeError(error);
        }
        return undefined;
    }
}

function* decodeError(error: unknown): Sync<void> {
    if (error instanceof SyntaxError) {
        const message = error.message;
        const position = (error as { pos?: unknown }).pos;
        if (typeof position === 'number') {
            yield* err(`${position} ${message}`);
            return;
        }
    }
    throw new Error(`Babel has thrown unknown error: ${error}`)
}