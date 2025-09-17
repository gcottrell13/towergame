import type {SMap} from "../types/SMap.ts";
import type {RoomIds} from "./room-defs.ts";
import type {IMAGES} from "./images.ts";

export const FLOOR_DEFS_RAW = {
    buildables: {
        basic: {
            name: 'Basic',
            background: 'basic-floor-bg.png',
            cost_to_build: 20,
            rooms: [],
        },
        'express-lobby': {
            name: 'Express Lobby',
            background: 'empty-floor-bg.png',
            cost_to_build: 20,
            rooms: [],
        },
    },
    empty: {
        name: 'Empty',
        background: 'empty-floor-bg.png',
        cost_to_build: 10,
    },
    roofs: {
        basic: {
            name: 'Roof 1',
            background: 'roof1.png',
            cost_to_build: 0,
        }
    },
    empty_roof: {
        name: 'Roof 1',
        background: 'roof1.png',
        cost_to_build: 0,
    },
} as const satisfies FloorDefsRaw;



export interface FloorDefRaw {
    name: string;
    background: IMAGES;
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