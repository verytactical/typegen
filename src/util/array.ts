export const filterUndefined = <T>(values: (T | undefined)[]): T[] => {
    const result: T[] = [];
    for (const value of values) {
        if (value) {
            result.push(value);
        }
    }
    return result;
};