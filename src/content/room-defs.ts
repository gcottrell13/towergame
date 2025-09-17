import type { SMap } from '../types/SMap.ts';
import type {IMAGES} from "./images.ts";

export const ROOM_DEFS_RAW = {
    'ad-1': {
        min_width: 4,
        max_width: 4,
        display_name: 'Best Viewed Ad',
        sprite_active: 'bestviewedcomp.gif',
        sprite_empty: 'bestviewedcomp.gif',
        cost_to_build: 10,
        cost_to_destroy: 0,
        build_thumb: 'bestviewedcomp.gif',
    },
    'hotel-basic-small': {
        min_width: 2,
        max_width: 2,
        display_name: 'Hotel Room',
        sprite_active: 'room-hotel-basic-small-occupied.png',
        sprite_empty: 'room-hotel-basic-small-empty.png',
        cost_to_build: 10,
        cost_to_destroy: 0,
        build_thumb: 'room-hotel-basic-small-empty.png',
    },
} as const satisfies SMap<RoomDefRaw>;

interface RoomDefRaw {
    min_height?: number;
    max_height?: number;
    min_width: number;
    max_width: number;
    display_name: string;
    sprite_active: IMAGES;
    sprite_empty: IMAGES;
    sprite_active_night?: IMAGES;
    sprite_empty_night?: IMAGES;
    cost_to_build: number;
    cost_to_destroy: number;
    build_thumb: IMAGES;
    tier?: number;
}
export type RoomIds = keyof typeof ROOM_DEFS_RAW;
