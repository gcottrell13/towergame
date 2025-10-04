import { DESTROY_ROOM_COST } from './constants.ts';
import type { Floor } from './types/Floor.ts';
import { FLOOR_DEFS } from './types/FloorDefinition.ts';

export function cost_to_rezone_floor(floor: Floor) {
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;
    return (floor.size_left + floor.size_right) * floor_def.cost_to_build + floor.rooms.length * DESTROY_ROOM_COST;
}
