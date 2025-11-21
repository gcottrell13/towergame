export function is<T extends F, F>(b: (a: F) => boolean): (x: F) => x is T {
    return (x): x is T => b(x);
}
