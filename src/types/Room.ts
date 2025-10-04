import type { int, uint } from './RestrictedTypes.ts';
import type { RoomKind } from './RoomDefinition.ts';

export enum RoomState {
    Unknown,
}

export interface Room {
    // also the id
    position: int;
    kind: RoomKind;
    state: RoomState;
    bottom_floor: int;
    height: uint;
    width: uint;
}
