import type { ReactElement } from 'react';
import {
    TRANSPORT_DEFS_RAW,
    type TransportationDefinitionRaw,
    type TransportationType,
} from '../content/transportation-defs.ts';
import type { Floor } from './Floor.ts';
import { as_uint_or_default, to_uint, type uint } from './RestrictedTypes.ts';

export type TransportationKind = string & { readonly __type: unique symbol };

export interface TransportationDefinition {
    d: 'transport';
    id: TransportationKind;
    name: string;
    cost_to_build(height: number): uint;
    type: TransportationType;
    sprite_empty: string;
    sprite_occupied: string | null;
    min_height: uint;
    max_height: uint;
    min_width: uint;
    can_stop_at_floor: ((f: Floor) => boolean) | null;
    tier: uint;
    overlay?: () => Promise<() => ReactElement>;
}

export const TRANSPORT_DEFS: {
    [p: TransportationKind]: TransportationDefinition;
} = Object.fromEntries(
    Object.entries(TRANSPORT_DEFS_RAW).map(([key, value]) => {
        return [key as TransportationKind, def_from_raw(key, value)];
    }),
);

function def_from_raw(id: string, raw: TransportationDefinitionRaw): TransportationDefinition {
    return {
        d: 'transport',
        id: id as TransportationKind,
        name: raw.name,
        type: raw.type,
        sprite_empty: raw.sprite_empty,
        sprite_occupied: raw.sprite_occupied ?? '',
        min_height: as_uint_or_default(raw.min_height ?? 1),
        max_height: as_uint_or_default(raw.max_height),
        min_width: as_uint_or_default(raw.width),
        can_stop_at_floor: raw.can_stop_at_floor ?? null,
        tier: as_uint_or_default(raw.tier ?? 0),
        overlay: raw.overlay,
        cost_to_build: cost_to_build(raw),
    };
}

function cost_to_build(raw: TransportationDefinitionRaw): TransportationDefinition['cost_to_build'] {
    if (raw.cost_per_floor instanceof Function) return raw.cost_per_floor;
    const c = as_uint_or_default(raw.cost_per_floor);
    return (h) => to_uint(c * h);
}
