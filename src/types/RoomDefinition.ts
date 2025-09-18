import type { uint } from './RestrictedTypes.ts';
import { ROOM_DEFS_RAW } from '../content/room-defs.ts';
import type {IMAGES} from "../content/images.ts";

/**
 * technically a number or string, but you should not inspect it at all, nor use it with any other types
 * @asType string
 */
export type RoomKind = number & {readonly __type: unique symbol};

export interface RoomDefinition {
    id: RoomKind;

    /**
     * @default 1
     * @optional
     */
    min_height: uint;
    /**
     * @default 1
     * @optional
     */
    max_height: uint;

    min_width: uint;
    max_width: uint;

    display_name: string;

    /**
     * @default null
     * @optional
     */
    sprite_active: IMAGES | null;
    sprite_empty: IMAGES;

    /**
     * @default null
     */
    sprite_active_night: IMAGES | null;
    /**
     * @default null
     */
    sprite_empty_night: IMAGES | null;

    cost_to_build: uint;
    cost_to_destroy: uint;
    build_thumb: IMAGES;

    /**
     * @default 0
     */
    tier: uint;
}

const ROOM_DEF_DEFAULTS: Partial<RoomDefinition> = {
    tier: 0 as uint,
    sprite_active: null,
    sprite_empty_night: null,
    sprite_active_night: null,
    max_height: 1 as uint,
    min_height: 1 as uint,
};

export const ROOM_DEFS: {
    [p: RoomKind]: RoomDefinition } = Object.fromEntries(
    Object.keys(ROOM_DEFS_RAW).map((id) => [
        id,
        {
            ...ROOM_DEF_DEFAULTS,
            ...(ROOM_DEFS_RAW[id as keyof typeof ROOM_DEFS_RAW] as any),
            id,
        },
    ]),
);