import { type Located, parseNoSkip, type Parser } from "@tonstudio/parser-runtime";
import { type LogEntry } from "./log";
import { type Async, catchInternalErrorsAsync, err, runAsync, type Sync } from "./process";
import { getErrorPrinter, getExpectedText } from "./source-error";
import { Intersect, makeMakeVisitor, Unwrap } from "./tricks";

type Inputs<I> = I extends { $: infer K }
    ? K extends string
        ? Record<K, (input: I) => Async<void>>
        : never
    : never;
type Handlers<I> = Unwrap<Intersect<Inputs<I>>>

export async function runCli<T>(
    grammar: Parser<Cli<T>>,
    handlers: Handlers<T | Version | Help>,
) {
    const args = process.argv.slice(2);
    const parseArgs = getArgParser(grammar);
    const { log, hadErrors } = getConsoleLogger();
    const visitor = makeVisitor<T | Help | Version>()(handlers) as
        unknown as (arg: Help | Version | T) => Async<void>;

    await runAsync(
        catchInternalErrorsAsync(async function* (){
            const parsedArgs = yield* parseArgs(args);
            yield* visitor(parsedArgs ?? Help);
        }),
        log,
    );

    if (hadErrors()) {
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

// visitor for parser AST nodes
const makeVisitor = makeMakeVisitor("$");

// Default error printer. Should be initialized in entry point instead
const errorPrinter = getErrorPrinter({
    // This should be `chalk.red`
    error: (s) => s,
    // This should be `chalk.gray`
    context: (s) => s,
    contextLines: 1,
});

const getArgParser = <T>(grammar: Parser<Cli<T>>) => {
    return function* parseArgs(argv: string[]): Sync<Help | Version | T | undefined> {
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
            const { expected, position } = result.error
            const text = getExpectedText(expected);
            const message = errorPrinter.show(argv.join(" ") + " ", {
                start: position - 1,
                end: position - 1,
            });
            yield* err(`Expected ${text}\n${message}`);
            return undefined;
        }
    };
};

const getConsoleLogger = () => {
    let hadErrors = false;
    const log = (logEntry: LogEntry) => {
        if (logEntry.$ === 'error') {
            hadErrors = true;
            console.error(logEntry.text);
        } else if (logEntry.$ === 'warn') {
            console.error(logEntry.text);
        } else {
            console.log(logEntry.text);
        }
    };
    return { log, hadErrors: () => hadErrors };
};