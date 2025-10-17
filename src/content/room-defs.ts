import type { ReactElement } from 'react';
import type { ResourceKind } from '../types/ResourceDefinition.ts';
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
        cost_to_build: { coin: 10 },
        build_thumb: images.BESTVIEWEDCOMP_GIF,
        production: { coin: 1 },
    },
    'hotel-basic-small': {
        min_width: 2,
        display_name: 'Hotel Room',
        sprite_active: images.ROOM_HOTEL_BASIC_SMALL_OCCUPIED_PNG,
        sprite_empty: images.ROOM_HOTEL_BASIC_SMALL_EMPTY_PNG,
        cost_to_build: { coin: 50 },
        build_thumb: 'room-hotel-basic-small-empty.png',
        production: { coin: 20 },
        workers_required: { faceless: 2 },
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

    cost_to_build: { [p in ResourceIds]: number } | ((width: uint, height: uint) => { [p: ResourceKind]: uint });

    /**
     * If empty, production happens only once per day
     */
    resource_requirements?: { [p in ResourceIds]: number };
    production?: { [p in ResourceIds]: number };
    workers_required?: { [p in TOWER_WORKER_KINDS]: number };
    // if zero or empty, production takes no time, but partially-staffed rooms only have a % chance equal to staffing to produce.
    // if greater than zero, partially-staffed rooms produce with % speed, taking longer.
    production_time?: number;
    produce_to_bank?: boolean;

    // how many workers are added to the building pool
    workers_produced?: { [p in TOWER_WORKER_KINDS]: number };
}
export type RoomIds = keyof typeof ROOM_DEFS_RAW;
