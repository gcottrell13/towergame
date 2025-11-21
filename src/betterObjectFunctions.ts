// a hack to get the proper keys
export const keys: <T extends { [p in string]: any }>(obj: T) => (keyof T)[] = Object.keys;

export const entries: <T extends { [p in string]: any }>(obj: T) => [keyof T, T[keyof T]][] = Object.entries;
