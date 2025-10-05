import type { ExtendsOmit } from '../types/extendsOmit.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { uint } from '../types/RestrictedTypes.ts';
import type { Room } from '../types/Room.ts';
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
