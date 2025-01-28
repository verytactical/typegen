import { isLeft } from "./either";
import { Async, catchInternalErrorsAsync, runAsync } from "./process";

export async function runCli(compile: (argv: string[]) => Async<void>) {
    const result = await runAsync(
        catchInternalErrorsAsync(() => compile(process.argv.slice(2)))
    );

    if (isLeft(result)) {
        for (const logEntry of result.left) {
            console.error(logEntry.text);
        }
        console.error('Failed');
        process.exit(30);
    }
};