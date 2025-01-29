import { z } from "zod";
import { basename, dirname, extname, join, relative } from "path";
import { glob, mkdir, readFile, writeFile } from "fs/promises";
import { parseTypeScript } from "./babel";
import { compileTypescript, Decls } from "./decode";
import { $ast, grammar } from './cli-grammar';
import { Async, Info, info, Log } from "../util/process";
import { runCli } from "../util/cli";
import { ShowAtLocation, withSourceAsync } from "../util/source-error";
import { cwd } from "process";
import { inspect } from "util";
import { generate } from "./generate";

export const main = () => runCli(grammar, {
    Compile: compile,
    Version: showVersion,
    Help: showHelp,
});

const tsExtension = '.ts';
const disjointTag = 'kind';

async function* compile({ pattern }: $ast.Compile): Async<void, Log> {
    // TODO: run parallel
    for await (const filePath of glob(pattern)) {
        const outputDir = join(dirname(filePath), 'generated');
        const getPath = (suffix: string) => join(
            outputDir,
            basename(filePath, tsExtension) + '.' + suffix + tsExtension
        );
        const extension = extname(filePath);
        if (extension !== tsExtension) {
            return;
        }
        // TODO: wrap FS errors (src/typegen/fs.ts)
        const source = await readFile(filePath, "utf-8");
        const sortedDecls = yield* withSourceAsync(
            resolve(filePath),
            source,
            (source) => parse(source, disjointTag),
        )(source);
        if (!sortedDecls) {
            return;
        }
        const declPath = getPath('cons');
        // yield* info(displayJson(sortedDecls[0]));
        const consCode = yield* generate(
            sortedDecls,
            importPath(filePath, declPath),
            disjointTag,
        );
        await mkdir(dirname(declPath), { recursive: true });
        await writeFile(declPath, consCode)
    }
}

function importPath(of: string, from: string) {
    return relative(join(from, '..'), of)
}

async function* parse(source: string, disjointTag: string): Async<undefined | Decls, Log & ShowAtLocation> {
    const ast = yield* parseTypeScript(source);
    if (!ast) {
        return;
    }
    return yield* compileTypescript(ast, disjointTag);
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