export type LogEntry = LogError | LogWarn
export type LogError = { $: 'error', text: string }
export const LogError = (text: string): LogError => ({ $: 'error', text });
export const isError = (entry: LogEntry): entry is LogError => entry.$ === 'error';
export type LogWarn = { $: 'warn', text: string }
export const LogWarn = (text: string): LogWarn => ({ $: 'warn', text });
export const isWarn = (entry: LogEntry): entry is LogWarn => entry.$ === 'warn';
