import { join } from "path";
import { readFile } from "fs/promises";
import { parseTypeScript } from "./babel";
import { compileTypescript } from "./decode";
import { runCli } from "./cli";

export async function* main(argv: string[]) {
    const fullPath = join(__dirname, '..', 'example', 'ast.ts');
    const source = await readFile(fullPath, "utf-8");
    const ast = yield* parseTypeScript(source);
    if (!ast) {
        return;
    }
    const result = yield* compileTypescript(ast);
    console.log(JSON.stringify(result, null, 4));
}

// FIXME
runCli(main);