import { as_uint_or_default, type uint } from './RestrictedTypes.ts';
import type { FloorKind } from './FloorDefinition.ts';
import {
    TRANSPORT_DEFS_RAW,
    type TransportationDefinitionRaw,
    type TransportationType,
} from '../content/transportation-defs.ts';
import type { ReactElement } from 'react';

export type TransportationKind = string & { readonly __type: unique symbol };

export interface TransportationDefinition {
    id: TransportationKind;
    name: string;
    cost_per_floor: uint;
    type: TransportationType;
    sprite_empty: string;
    sprite_occupied: string | null;
    min_height: uint;
    max_height: uint;
    width: uint;
    stops_floor_kind: FloorKind | null;
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

function def_from_raw(
    id: string,
    raw: TransportationDefinitionRaw,
): TransportationDefinition {
    return {
        id: id as any,
        name: raw.name,
        type: raw.type,
        sprite_empty: raw.sprite_empty,
        sprite_occupied: raw.sprite_occupied ?? '',
        min_height: as_uint_or_default(raw.min_height ?? 1),
        max_height: as_uint_or_default(raw.max_height),
        width: as_uint_or_default(raw.width),
        stops_floor_kind: raw.stops_floor_kind as any,
        tier: as_uint_or_default(raw.tier ?? 0),
        overlay: raw.overlay,
        cost_per_floor: as_uint_or_default(raw.cost_per_floor),
    };
}
