import type { ReactElement } from 'react';
import type { uint } from '../types/RestrictedTypes.ts';
import type { SMap } from '../types/SMap.ts';
import images from './images.ts';
import type { ResourceIds } from './resource-defs.ts';
import type { TOWER_WORKER_KINDS } from './tower-worker-defs.ts';

export enum RoomCategory {
    Room,
}

export const ROOM_DEFS_RAW = {
    'ad-1': {
        min_width: 4,
        min_height: 1,
        display_name: 'Best Viewed Ad',
        sprite_active: images.BESTVIEWEDCOMP_GIF,
        sprite_empty: images.BESTVIEWEDCOMP_GIF,
        cost_to_build: 10,
        build_thumb: images.BESTVIEWEDCOMP_GIF,
        production: [['coin', 1]],
    },
    'hotel-basic-small': {
        min_width: 2,
        display_name: 'Hotel Room',
        sprite_active: images.ROOM_HOTEL_BASIC_SMALL_OCCUPIED_PNG,
        sprite_empty: images.ROOM_HOTEL_BASIC_SMALL_EMPTY_PNG,
        cost_to_build: 50,
        build_thumb: 'room-hotel-basic-small-empty.png',
        production: [['coin', 20]],
        workers: ['faceless'],
    },
} as const satisfies SMap<RoomDefRaw>;

export interface RoomDefRaw {
    min_height?: number;
    max_height?: number;
    min_width: number;
    max_width?: number;
    display_name: string;
    sprite_active: string;
    sprite_empty: string;
    sprite_active_night?: string;
    sprite_empty_night?: string;
    build_thumb: string;
    tier?: number;
    category?: RoomCategory;
    overlay?: () => Promise<() => ReactElement>;

    cost_to_build: number | ((width: uint, height: uint) => uint);

    /**
     * If empty, production happens only once per day
     */
    resource_requirements?: [ResourceIds, number][];
    production?: [ResourceIds, number][];
    workers?: TOWER_WORKER_KINDS[];
}
export type RoomIds = keyof typeof ROOM_DEFS_RAW;
