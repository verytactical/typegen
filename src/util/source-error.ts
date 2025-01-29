import { Async, Colors, contextColor, define, errorColor, GetSyncEffectOf, handleAsync, handleSync, sourceColor, Sync, traverse } from "./process";

const isEndline = (s: string) => s === "\n";

const repeat = (s: string, n: number): string => new Array(n + 1).join(s);

type Range = {
    start: number;
    end: number;
};

const intersect = (a: Range, b: Range): Range => {
    return {
        start: Math.max(a.start, b.start),
        end: Math.min(a.end, b.end),
    };
};

const shift = (a: Range, b: number) => {
    return {
        start: a.start + b,
        end: a.end + b,
    };
};

type Line = {
    id: number;
    text: string;
    range: Range;
};

/**
 * Convert code into a list of lines
 */
const toLines = (source: string): Line[] => {
    const result: Line[] = [];
    let position = 0;
    for (const [id, text] of source.split("\n").entries()) {
        result.push({
            id,
            text,
            range: {
                start: position,
                end: position + text.length,
            },
        });
        position += text.length + 1;
    }
    return result;
};

/**
 * Should wrap string into ANSI codes for coloring
 */
type Colorer = (s: string) => string;

type ErrorPrinterParams = {
    /**
     * Number of context lines below and above error
     */
    contextLines: number;
    /**
     * Colorer for code with error
     */
    error: Colorer;
    /**
     * Colorer for context lines of code
     */
    context: Colorer;
};

export const getExpectedText = (expected: ReadonlySet<string>) => {
    const result: string[] = [];
    const failures = [...expected].sort();
    for (const [idx, failure] of failures.entries()) {
        if (idx > 0) {
            if (idx === failures.length - 1) {
                result.push(failures.length > 2 ? ", or " : " or ");
            } else {
                result.push(", ");
            }
        }
        result.push(failure);
    }
    return result.join("");
};

type DisplayLine = {
    id: number | null,
    text: string,
    hasInterval: boolean,
    startOfError: number,
}

function* displayLine(line: Line, range: Range): Sync<DisplayLine[], Colors> {
    // Only the line that contains range.start is underlined in error message
    // Otherwise error on `while (...) {}` would display the whole loop body, for example
    const hasInterval =
        line.range.start <= range.start && range.start < line.range.end;

    // Find the line-relative range
    const mapped = shift(intersect(range, line.range), -line.range.start);

    // All lines except with error message are displayed in gray
    if (!hasInterval) {
        return [
            {
                id: line.id,
                text: yield* contextColor(line.text),
                hasInterval,
                startOfError: mapped.start,
            },
        ];
    }

    // Source line with error colored
    const sourceLine: DisplayLine = {
        id: line.id,
        text: [
            line.text.substring(0, mapped.start),
            yield* errorColor(line.text.substring(mapped.start, mapped.end)),
            line.text.substring(mapped.end),
        ].join(""),
        hasInterval: true,
        startOfError: mapped.start,
    };

    // Wiggly line underneath it
    const underline: DisplayLine = {
        id: null,
        text: [
            repeat(" ", mapped.start),
            "^",
            repeat("~", Math.max(0, mapped.end - mapped.start - 1)),
        ].join(""),
        hasInterval: true,
        startOfError: mapped.start,
    };

    return [sourceLine, underline];
};

function* showSourceError(
    message: string,
    fileName: string,
    source: string, 
    range: Range, 
    numContextLines: number = 1,
): Sync<string, Colors> {
    // Display all lines of source file
    const lines = (yield* traverse(
        toLines(source),
        (line) => displayLine(line, range),
    )).flat();

    // Find first and lines lines with error message
    const firstLineNum = lines.findIndex((line) => line.hasInterval);
    const lastLineNum = lines.findLastIndex((line) => line.hasInterval);
    if (firstLineNum === -1 || lastLineNum === -1) {
        throw new Error(
            `Interval [${range.start}, ${range.end}[ is empty or out of source bounds (${source.length})`,
        );
    }

    // Expand the line range so that `contextLines` are above and below
    const rangeStart = Math.max(0, firstLineNum - numContextLines);
    const rangeEnd = Math.min(lines.length - 1, lastLineNum + numContextLines);

    // Pick displayed lines out of full list
    const displayedLines = lines.slice(rangeStart, rangeEnd + 1);

    // Find padding based on the line with largest line number
    const maxLineId = displayedLines.reduce((acc, line) => {
        return line.id === null ? acc : Math.max(acc, line.id);
    }, 1);
    const lineNumLength = String(maxLineId + 1).length;

    // Add line numbers and cursor to lines
    const paddedLines = displayedLines.map(({ hasInterval, id, text }) => {
        const prefix = hasInterval && id !== null ? ">" : " ";
        const paddedLineNum =
            id === null
                ? repeat(" ", lineNumLength) + "  "
                : String(id + 1).padStart(lineNumLength) + " |";
        return `${prefix} ${paddedLineNum} ${text}`;
    });

    const prefix = source.substring(0, range.start).split("");
    const lineNum = prefix.filter(isEndline).length;
    const prevLineEndPos = prefix.findLastIndex(isEndline);
    const lineStartPos = prevLineEndPos === -1 ? 0 : prevLineEndPos + 1;
    const colNum = range.start - lineStartPos;

    const resultLines = paddedLines.join("\n");
    return `${message} (${yield* sourceColor(fileName)}:${lineNum + 1}:${colNum + 1})\n${resultLines}\n`;
};

export const showAtLocation = define<(text: string, start: number, end: number) => string>()('showLocation');
export interface ShowAtLocation extends GetSyncEffectOf<typeof showAtLocation> {}

export const withSourceSync = <A extends any[], T, C>(
    fileNameRelativeToCwd: string,
    source: string,
    fn: (...args: A) => Sync<T, C & ShowAtLocation>
): (...args: A) => Sync<T, C & Colors> => {
    return handleSync(fn, {
        *showLocation(text: string, start: number, end: number) {
            return yield* showSourceError(text, fileNameRelativeToCwd, source, { start, end });
        },
    // TS bug: too generic!
    } as any) as any;
};

export const withSourceAsync = <A extends any[], T, C>(
    fileNameRelativeToCwd: string,
    source: string,
    fn: (...args: A) => Async<T, C & ShowAtLocation>
): (...args: A) => Async<T, C & Colors> => {
    return handleAsync(fn, {
        *showLocation(text: string, start: number, end: number) {
            return yield* showSourceError(text, fileNameRelativeToCwd, source, { start, end });
        },
    // TS bug: too generic!
    } as any) as any;
};