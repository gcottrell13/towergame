import { DESTROY_ROOM_COST, FLOOR_HEIGHT, PIXELS_PER_UNIT } from './constants.ts';
import type { Floor } from './types/Floor.ts';
import { FLOOR_DEFS } from './types/FloorDefinition.ts';

export function cost_to_rezone_floor(floor: Floor) {
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;
    return (floor.size_left + floor.size_right) * floor_def.cost_to_build + floor.rooms.length * DESTROY_ROOM_COST;
}

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
