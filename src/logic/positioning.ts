import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';

/**
 * ``` `${(units ?? 0) * PIXELS_PER_UNIT + plus}px`; ```
 * @param units
 * @param plus
 */
export function hori(units: number | undefined | null, plus: number = 0) {
    return `${(units ?? 0) * PIXELS_PER_UNIT + plus}px`;
}

/**
 * ``` `${(units ?? 0) * FLOOR_HEIGHT + plus}px`; ```
 * @param units
 * @param plus
 */
export function verti(units: number | undefined | null, plus: number = 0) {
    return `${(units ?? 0) * FLOOR_HEIGHT + plus}px`;
}
