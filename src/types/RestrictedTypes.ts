
/**
 * technically just a number
 * @asType integer
 * @minimum 0
 */
export type uint = number & {readonly __type: unique symbol};

export function is_uint(x: number): x is uint {
    return x >= 0 && x % 1 === 0;
}

export function as_uint(x: number): uint | null {
    return is_uint(x) ? x : null;
}

export function as_uint_or_default(x: number): uint {
    return is_uint(x) ? x : 0 as uint;
}

/**
 * technically just a number
 * @asType integer
 */
export type int = number & {readonly __type: unique symbol};

export function is_int(x: number): x is int {
    return x % 1 === 0;
}

export function as_int(x: number): int | null {
    return is_int(x) ? x : null;
}

export function as_int_or_default(x: number): int {
    return is_int(x) ? x : 0 as int;
}