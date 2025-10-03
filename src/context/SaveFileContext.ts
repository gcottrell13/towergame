import { createContext } from 'react';
import type { SaveFile } from '../types/SaveFile.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { Dispatch } from '../types/dispatch.ts';
import type { Building } from '../types/Building.ts';
import type { Room } from '../types/Room.ts';
import type { Floor } from '../types/Floor.ts';
import type { Transportation } from '../types/Transportation.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';

interface BuyRoom {
    type: 'buy-room';
    building: Building;
    floor: Floor;
    room: Room;
}

interface BuyTransport {
    type: 'buy-transport';
    building: Building;
    transport: Transportation;
}

interface AddFloor {
    type: 'add-floor';
    building: Building;
    position: 'top' | 'underground';
}

interface RezoneFloor {
    type: 'rezone-floor';
    building: Building;
    floor: Floor;
    kind: FloorKind;
}

interface ExtendFloor {
    type: 'extend-floor';
    building: Building;
    floor: Floor;
    size_left?: uint;
    size_right?: uint;
}

export type SaveFileActions =
    | BuyRoom
    | BuyTransport
    | AddFloor
    | RezoneFloor
    | ExtendFloor;

export const SaveFileContext = createContext<
    [SaveFile, Dispatch<SaveFileActions>]
>([
    {
        buildings: [],
        money: 0 as int,
        new_things_acked: {},
        rating: 0 as uint,
    },
    () => {},
]);
