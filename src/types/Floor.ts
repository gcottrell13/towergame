import type { FloorKind } from './FloorDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { Room } from './Room.ts';

export interface Floor {
    height: int;
    kind: FloorKind | null;
    size_left: uint;
    size_right: uint;
    rooms: Room[];
}
