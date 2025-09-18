import type { SMap } from '../types/SMap.ts';
import type { RoomIds } from './room-defs.ts';
import images from './images.ts';

export const FLOOR_DEFS_RAW = {
    buildables: {
        basic: {
            name: 'Basic',
            background: images.BASIC_FLOOR_BG_PNG,
            cost_to_build: 20,
            rooms: ['hotel-basic-small', 'ad-1'],
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
}
