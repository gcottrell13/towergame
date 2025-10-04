import type { ReactElement } from 'react';
import { ROOM_DEFS_RAW, RoomCategory, type RoomDefRaw } from '../content/room-defs.ts';
import { as_uint_or_default, to_uint, type uint } from './RestrictedTypes.ts';

/**
 * technically a number or string, but you should not inspect it at all, nor use it with any other types
 * @asType string
 */
export type RoomKind = number & { readonly __type: unique symbol };

export interface RoomDefinition {
    d: 'room';

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

    /**
     * the width can only be multiples of this number
     * @default min_width
     */
    width_multiples_of: uint;

    display_name: string;

    /**
     * @default null
     * @optional
     */
    sprite_active: string | null;
    sprite_empty: string;

    /**
     * @default null
     */
    sprite_active_night: string | null;
    /**
     * @default null
     */
    sprite_empty_night: string | null;

    cost_to_build(width: number, height: number): uint;

    build_thumb: string;

    /**
     * @default 0
     */
    tier: uint;

    category: RoomCategory;
    overlay?: () => Promise<() => ReactElement>;
}

export const ROOM_DEFS: {
    [p: RoomKind]: RoomDefinition;
} = Object.fromEntries(Object.entries(ROOM_DEFS_RAW).map(([id, value]) => [id, def_from_raw(id, value)]));

function def_from_raw(id: string, raw: RoomDefRaw): RoomDefinition {
    return {
        d: 'room',
        id: id as any,
        category: raw.category ?? RoomCategory.Room,
        cost_to_build: process_cost_to_build(raw),
        min_width: as_uint_or_default(raw.min_width),
        width_multiples_of: as_uint_or_default(raw.min_width),
        max_width: as_uint_or_default(raw.max_width ?? raw.min_width),
        tier: as_uint_or_default(raw.tier ?? 0),
        sprite_empty: raw.sprite_empty,
        min_height: as_uint_or_default(raw.min_height ?? 1),
        display_name: raw.display_name,
        max_height: as_uint_or_default(raw.max_height ?? 1),
        sprite_active_night: raw.sprite_active_night ?? '',
        sprite_empty_night: raw.sprite_empty_night ?? '',
        build_thumb: raw.build_thumb,
        sprite_active: raw.sprite_active,
        overlay: raw.overlay,
    };
}

function process_cost_to_build(t: RoomDefRaw): RoomDefinition['cost_to_build'] {
    if (t.cost_to_build instanceof Function) {
        return t.cost_to_build;
    }
    const a = as_uint_or_default(t.cost_to_build);
    return (w, h) => {
        return as_uint_or_default(a * to_uint((w * h) / t.min_width));
    };
}
