import type { ReactElement } from 'react';
import { ROOM_DEFS_RAW, RoomCategory, type RoomDefRaw } from '../content/room-defs.ts';
import type { ResourceMap } from './ResourceDefinition.ts';
import { as_uint_or_default, to_uint, type uint } from './RestrictedTypes.ts';
import type { TowerWorkerKind } from './TowerWorkerDefinition.ts';

/**
 * technically a number or string, but you should not inspect it at all, nor use it with any other types
 * @asType string
 */
export type RoomKind = string & { readonly __type: unique symbol };

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

    cost_to_build(width: number, height: number): ResourceMap<uint>;

    build_thumb: string;

    /**
     * what tier will unlock this room
     * @default 0
     */
    tier: uint;

    category: RoomCategory;
    overlay?: () => Promise<() => ReactElement>;

    /**
     * If empty, production happens only once per day
     */
    resource_requirements?: ResourceMap<uint>;
    production?: ResourceMap<uint>;
    workers?: { [p in TowerWorkerKind]: number };

    // if zero or empty, production takes no time, but partially-staffed rooms only have a % chance equal to staffing to produce (per production tick).
    // if greater than zero, partially-staffed rooms produce with % speed, taking longer.
    production_time: uint;

    // if true, then all outputs will be added to the building bank instead of being used for further production
    produce_to_bank: boolean;
}

export const ROOM_DEFS: {
    [p: RoomKind]: RoomDefinition;
} = Object.fromEntries(Object.entries(ROOM_DEFS_RAW).map(([id, value]) => [id, def_from_raw(id, value)]));

function def_from_raw(id: string, raw: RoomDefRaw): RoomDefinition {
    return {
        d: 'room',
        // @ts-expect-error
        id,
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
        resource_requirements: raw.resource_requirements,
        production: raw.production,
        workers: raw.workers,
        production_time: as_uint_or_default(raw.production_time ?? 0),
        produce_to_bank: raw.produce_to_bank ?? false,
    };
}

function process_cost_to_build(t: RoomDefRaw): RoomDefinition['cost_to_build'] {
    if (t.cost_to_build instanceof Function) {
        return t.cost_to_build;
    }
    const a = Object.fromEntries(
        Object.entries(t.cost_to_build).map(([key, value]) => [key, as_uint_or_default(value)]),
    );
    return (w, h) => {
        return Object.fromEntries(
            Object.entries(a).map(([key, a]) => [key, as_uint_or_default(a * to_uint((w * h) / t.min_width))]),
        );
    };
}
