/**
 * technically just a number
 * @asType integer
 * @minimum 0
 */
export type uint = number & { readonly __type: unique symbol };

export function is_uint(n: number): n is uint {
    return n >= 0 && n % 1 === 0;
}

export function as_uint(n: number): uint | null {
    return is_uint(n) ? n : null;
}

export function as_uint_or_default(n: number): uint {
    return is_uint(n) ? n : (0 as uint);
}

export function to_uint(n: number): uint {
    return n > 0 ? Math.floor(n) as uint : 0 as uint;
}

/**
 * technically just a number
 * @asType integer
 */
export type int = number & { readonly __type: unique symbol };

export function is_int(n: number): n is int {
    return n % 1 === 0;
}

export function as_int(n: number): int | null {
    return is_int(n) ? n : null;
}

export function as_int_or_default(n: number): int {
    return is_int(n) ? n : (0 as int);
}
