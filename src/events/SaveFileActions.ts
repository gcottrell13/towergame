import type { DiscriminatedUnion } from '../types/DiscriminatedUnion.ts';
import type { ExtendsOmit } from '../types/extendsOmit.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { RoomKind } from '../types/RoomDefinition.ts';
import type { Transportation } from '../types/Transportation.ts';

export type SaveFileActions = DiscriminatedUnion<
    'action',
    {
        'buy-perm-upgrade': {
            name: string;
        };
        'buy-room': {
            building_id: number;
            floor_id: number;
            room: { width: uint; height: uint; kind: RoomKind; position: int; bottom_floor: int };
        };
        'buy-transport': {
            building_id: number;
            kind: Transportation['kind'];
            position: Transportation['position'];
            height: Transportation['height'];
            bottom_floor: Transportation['bottom_floor'];
        };
        'add-floor': {
            building_id: number;
            position: 'top' | 'underground';
        };
        'rezone-floor': {
            building_id: number;
            floor_id: number;
            kind: FloorKind;
        };
        'extend-floor': {
            building_id: number;
            floor_id: number;
            size_left?: uint;
            size_right?: uint;
        };
        'tick-building-time': {
            building_id: number;
            delta: number;
        };
        'start-day': {
            building_id: number;
        };
        'stop-day': {
            building_id: number;
        };
    }
>;

export type BuildingActions = ExtendsOmit<SaveFileActions, 'building_id'>;
export type TransportActions = ExtendsOmit<BuildingActions, 'transport_id'>;
export type FloorActions = ExtendsOmit<BuildingActions, 'floor_id'>;
export type RoomActions = ExtendsOmit<FloorActions, 'room_id'>;
