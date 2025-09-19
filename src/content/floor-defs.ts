import type { SMap } from '../types/SMap.ts';
import type { RoomIds } from './room-defs.ts';
import images from './images.ts';
import type { uint } from '../types/RestrictedTypes.ts';

export const FLOOR_DEFS_RAW = {
    buildables: {
        basic: {
            name: 'Basic',
            background: images.BASIC_FLOOR_BG_PNG,
            cost_to_build: 10,
            rooms: ['hotel-basic-small', 'ad-1', 'stairwell', 'elevator_small'],
        },
        'express-lobby': {
            name: 'Express Lobby',
            background: images.BASIC_FLOOR_BG_PNG,
            cost_to_build: 20,
            rooms: [],
        },
    },
    empty: {
        name: 'Empty',
        background: images.EMPTY_FLOOR_BG_PNG,
        cost_to_build: 10,
        rooms: ['stairwell', 'elevator_small'],
    },
    roofs: {
        basic: {
            name: 'Roof 1',
            background: images.ROOF1_PNG,
            cost_to_build: 0,
        },
    },
    empty_roof: {
        name: 'Roof 1',
        background: images.ROOF1_PNG,
        cost_to_build: 0,
    },
    new_floor_size: [5 as uint, 5 as uint],
} as const satisfies FloorDefsRaw;

export interface FloorDefRaw {
    name: string;
    background: string;
    /**
     * @type integer
     */
    cost_to_build: number;
    /**
     * @type integer
     */
    tier?: number;
    rooms?: RoomIds[];
}
export interface FloorDefsRaw {
    roofs: SMap<FloorDefRaw>;
    buildables: SMap<FloorDefRaw>;
    empty_roof: FloorDefRaw;
    empty: FloorDefRaw;
    new_floor_size: [uint, uint];
}
