import { createContext } from 'react';
import type { Dispatch } from '../types/dispatch.ts';
import type { ExtendsOmit } from '../types/extendsOmit.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { Room } from '../types/Room.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import type { Transportation } from '../types/Transportation.ts';

interface BuyRoom {
    action: 'buy-room';
    building_id: number;
    floor_id: number;
    room: Room;
}

interface BuyTransport {
    action: 'buy-transport';
    building_id: number;
    transport: Transportation;
}

interface AddFloor {
    action: 'add-floor';
    building_id: number;
    position: 'top' | 'underground';
}

interface RezoneFloor {
    action: 'rezone-floor';
    building_id: number;
    floor_id: number;
    kind: FloorKind;
}

interface ExtendFloor {
    action: 'extend-floor';
    building_id: number;
    floor_id: number;
    size_left?: uint;
    size_right?: uint;
}

export type SaveFileActions = BuyRoom | BuyTransport | AddFloor | RezoneFloor | ExtendFloor;

export type BuildingActions = ExtendsOmit<SaveFileActions, 'building_id'>;
export type TransportActions = ExtendsOmit<BuildingActions, 'transport_id'>;
export type FloorActions = ExtendsOmit<BuildingActions, 'floor_id'>;
export type RoomActions = ExtendsOmit<FloorActions, 'room_id'>;

export const SaveFileContext = createContext<[SaveFile, Dispatch<SaveFileActions>]>([
    {
        buildings: [],
        money: 0 as int,
        new_things_acked: {},
        rating: 0 as uint,
    },
    () => {},
]);
