import { join, relative } from "path";
import { glob, readFile } from "fs/promises";
import { parseTypeScript } from "./babel";
import { compileTypescript } from "./decode";
import { $ast, grammar } from './cli-grammar';
import { Async, Info, info, Log } from "../util/process";
import { z } from "zod";
import { runCli } from "../util/cli";
import { ShowAtLocation, withSourceAsync } from "../util/source-error";
import { cwd } from "process";
import { inspect } from "util";
import { sort } from "./sort";

export const main = () => runCli(grammar, {
    Compile: compile,
    Version: showVersion,
    Help: showHelp,
});

async function* compile({ pattern }: $ast.Compile): Async<void, Log> {
    // TODO: run parallel
    for await (const filePath of glob(pattern)) {
        // TODO: wrap FS errors (src/typegen/fs.ts)
        const source = await readFile(filePath, "utf-8");
        yield* withSourceAsync(
            resolve(filePath),
            source,
            compileOne,
        )(source);
    }
}

async function* compileOne(source: string): Async<void, Log & ShowAtLocation> {
    const ast = yield* parseTypeScript(source);
    if (!ast) {
        return;
    }
    const result = yield* compileTypescript(ast);
    yield* sort(result);
    // yield* info(displayJson(result));
}

const displayJson = (obj: unknown) => inspect(obj, { colors: true, depth: Infinity });

const resolve = (path: string) => {
    const result = relative(cwd(), path);
    return result.startsWith('.') ? result : './' + result;
}

const helpMessage = `Usage
$ typegen PATTERN
$ typegen --version
$ typegen --help

Flags
    PATTERN                     Specify paths for .ts files to generate helpers for
    -v, --version               Print Tact compiler version and exit
    -h, --help                  Display this text and exit

Examples
    $ typegen **/*.types.ts
`;
async function* showHelp(_: $ast.Help): Async<void, Info> {
    yield* info(helpMessage);
}

async function* showVersion(_: $ast.Version): Async<void, Info> {
    const packageSchema = z.object({
        version: z.string(),
    });
    const packagePath = join(__dirname, '../../package.json');
    const pkg = packageSchema.parse(
        JSON.parse(await readFile(packagePath, "utf-8")),
    );
    yield* info(pkg.version);
}