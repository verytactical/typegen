import { gray, red, yellow } from "picocolors";
import { type Located, parseNoSkip, type Parser } from "@tonstudio/parser-runtime";
import { type Async, catchInternalErrorsAsync, Err, err, handleAsync, Log, runAsync, type Sync } from "./process";
import { getExpectedText, ShowAtLocation, showAtLocation, withSourceSync } from "./source-error";
import { Intersect, makeMakeVisitor, Unwrap } from "./tricks";

type Inputs<I> = I extends { $: infer K }
    ? K extends string
        ? Record<K, (input: I) => Async<void, Log>>
        : never
    : never;
type Handlers<I> = Unwrap<Intersect<Inputs<I>>>

// visitor for parser AST nodes
const makeVisitor = makeMakeVisitor("$");

export async function runCli<T>(
    grammar: Parser<Cli<T>>,
    handlers: Handlers<T | Version | Help>,
) {
    const args = process.argv.slice(2);
    const parseArgs = getArgParser(grammar);
    const visitor = makeVisitor<T | Help | Version>()(handlers) as
        unknown as (arg: Help | Version | T) => Async<void, Log>;

    let hadErrors = false;
    await runAsync(handleAsync(
        catchInternalErrorsAsync(async function* () {
            const parsedArgs = yield* parseArgs(args);
            yield* visitor(parsedArgs ?? Help);
        }),
        {
            *err(text) {
                hadErrors = true;
                console.error(text);
            },
            *warn(text) {
                console.error(text);
            },
            *info(text) {
                console.log(text);
            },
            *contextColor(text) {
                return gray(text);
            },
            *errorColor(text) {
                return red(text);
            },
            *sourceColor(text) {
                return yellow(text);
            },
        }
    ));

    if (hadErrors) {
        process.exit(30);
    }
};

type Cli<T> = Generic<T> | NoParams;
type Generic<T> = Located<{
    readonly $: "Generic";
    readonly check: { sep: "\uD83E" };
    readonly args: T | Help | Version;
}>;
type NoParams = Located<{
    readonly $: "NoParams";
}>;
type Version = Located<{
    readonly $: "Version";
}>;
type Help = Located<{
    readonly $: "Help";
}>;
const Help: Help = { $: 'Help', loc: { $: "range", start: 0, end: 0 } };

const getArgParser = <T>(grammar: Parser<Cli<T>>) => {
    function* parseArgs(argv: string[]): Sync<
        Help | Version | T | undefined,
        Err & ShowAtLocation
    > {
        const separator = "\uD83E";
        const badArg = argv.find((arg) => arg.includes(separator));
        if (typeof badArg !== 'undefined') {
            throw new Error(`Really? ${badArg}`);
        }
        const result = parseNoSkip(
            separator + argv.join(separator) + separator,
            grammar,
        );
        if (result.$ === 'success') {
            const value = result.value;
            if (value.$ === 'Generic') {
                return value.args;
            } else {
                return Help;
            }
        } else {
            const { expected, position } = result.error;
            const text = getExpectedText(expected);
            if (position !== -1) {
                yield* err(yield* showAtLocation(
                    `Expected ${text}`,
                    position - 1,
                    position - 1,
                ));
            } else {
                yield* err(yield* showAtLocation(
                    `Wrong command line`, 0, 0,
                ));
            }
            return undefined;
        }
    };

    return (argv: string[]) => {
        const source = argv.join(" ") + "  ";
        return withSourceSync("arguments", source, parseArgs)(argv);
    };
};
