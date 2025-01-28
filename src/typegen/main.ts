import { join } from "path";
import { glob, readFile } from "fs/promises";
import { parseTypeScript } from "./babel";
import { compileTypescript } from "./decode";
import { $ast, grammar } from './cli-grammar';
import { info } from "../util/process";
import { z } from "zod";
import { runCli } from "../util/cli";

export const main = () => runCli(grammar, {
    Compile: compile,
    Version: showVersion,
    Help: showHelp,
});

async function* compile({ pattern }: $ast.Compile) {
    // TODO: run parallel
    for await (const filePath of glob(pattern)) {
        // TODO: wrap errors
        const source = await readFile(filePath, "utf-8");
        const ast = yield* parseTypeScript(source);
        if (!ast) {
            return;
        }
        const result = yield* compileTypescript(ast);
        console.log(JSON.stringify(result, null, 4));
    }
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
async function* showHelp(_: $ast.Help) {
    yield* info(helpMessage);
}

async function* showVersion(_: $ast.Version) {
    const packageSchema = z.object({
        version: z.string(),
    });
    const packagePath = join(__dirname, '../../package.json');
    const pkg = packageSchema.parse(
        JSON.parse(await readFile(packagePath, "utf-8")),
    );
    yield* info(pkg.version);
}