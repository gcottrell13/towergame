import type { SMap } from '../types/SMap.ts';
import images from './images.ts';

export const ROOM_DEFS_RAW = {
    'ad-1': {
        min_width: 4,
        max_width: 4,
        display_name: 'Best Viewed Ad',
        sprite_active: images.BESTVIEWEDCOMP_GIF,
        sprite_empty: images.BESTVIEWEDCOMP_GIF,
        cost_to_build: 10,
        cost_to_destroy: 0,
        build_thumb: images.BESTVIEWEDCOMP_GIF,
    },
    'hotel-basic-small': {
        min_width: 2,
        max_width: 2,
        display_name: 'Hotel Room',
        sprite_active: images.ROOM_HOTEL_BASIC_SMALL_OCCUPIED_PNG,
        sprite_empty: images.ROOM_HOTEL_BASIC_SMALL_EMPTY_PNG,
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
    sprite_active: string;
    sprite_empty: string;
    sprite_active_night?: string;
    sprite_empty_night?: string;
    cost_to_build: number;
    cost_to_destroy: number;
    build_thumb: string;
    tier?: number;
}
export type RoomIds = keyof typeof ROOM_DEFS_RAW;
