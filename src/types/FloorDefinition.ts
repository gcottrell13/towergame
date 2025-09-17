import { as_uint_or_default, type uint } from './RestrictedTypes.ts';
import type { RoomKind } from './RoomDefinition.ts';
import { FLOOR_DEFS_RAW, type FloorDefRaw } from '../content/floor-defs.ts';
import type {IMAGES} from "../content/images.ts";

/**
 * technically a number or string, but you should not inspect it at all, nor use it with any other types
 * @asType string
 */
export type FloorKind = symbol;

export interface FloorDefinition {
    id: FloorKind;
    name: string;
    background: IMAGES;
    cost_to_build: uint;
    tier: uint;

    rooms: RoomKind[];
}

interface FloorDefs {
    roofs: { [p: FloorKind]: FloorDefinition };
    buildables: { [p: FloorKind]: FloorDefinition };
    empty_roof: FloorDefinition;
    empty: FloorDefinition;
}

export const FLOOR_DEFS: FloorDefs = {
    empty: def_from_raw('', FLOOR_DEFS_RAW.empty),
    buildables: Object.fromEntries(
        Object.keys(FLOOR_DEFS_RAW.buildables).map((id) => [
            id,
            def_from_raw(
                id,
                FLOOR_DEFS_RAW.buildables[
                    id as keyof typeof FLOOR_DEFS_RAW.buildables
                ],
            ),
        ]),
    ),
    empty_roof: def_from_raw('', FLOOR_DEFS_RAW.empty_roof),
    roofs: Object.fromEntries(
        Object.keys(FLOOR_DEFS_RAW.roofs).map((id) => [
            id,
            def_from_raw(
                id,
                FLOOR_DEFS_RAW.roofs[id as keyof typeof FLOOR_DEFS_RAW.roofs],
            ),
        ]),
    ),
};

function def_from_raw(id: string, item: FloorDefRaw): FloorDefinition {
    return {
        id: id as any,
        tier: as_uint_or_default(item.tier ?? 0),
        background: item.background,
        name: item.name,
        cost_to_build: as_uint_or_default(item.cost_to_build),
        rooms: (item.rooms as any) ?? [],
    };
}
