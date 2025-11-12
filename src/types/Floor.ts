import type { FloorKind } from './FloorDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { Room } from './Room.ts';

export type FloorId = int & { readonly _f_type: unique symbol };

export interface Floor {
    height: FloorId;
    kind: FloorKind | null;
    size_left: uint;
    size_right: uint;
    rooms: Room[];
}

export function Default(): Floor {
    return {
        height: 0 as FloorId,
        size_right: 0 as uint,
        size_left: 0 as uint,
        rooms: [],
        kind: '' as FloorKind,
    };
}
