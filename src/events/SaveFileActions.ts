import type { DiscriminatedUnion } from '../types/DiscriminatedUnion.ts';
import type { ExtendsOmit } from '../types/extendsOmit.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { RoomKind } from '../types/RoomDefinition.ts';
import type { Transportation } from '../types/Transportation.ts';
import type {TowerWorkerId, WorkerStats} from '../types/TowerWorker.ts';
import type { BuildingId } from '../types/Building.ts';
import type { FloorId } from '../types/Floor.ts';
import type {TowerWorkerKind} from "../types/TowerWorkerDefinition.ts";

export type SaveFileActions = DiscriminatedUnion<
    'action',
    {
        'buy-perm-upgrade': {
            name: string;
        };
        'buy-room': {
            building_id: BuildingId;
            floor_id: FloorId;
            room: { width: uint; height: uint; kind: RoomKind; position: int; bottom_floor: int };
        };
        'buy-transport': {
            building_id: BuildingId;
            kind: Transportation['kind'];
            position: Transportation['position'];
            height: Transportation['height'];
            bottom_floor: Transportation['bottom_floor'];
        };
        'add-floor': {
            building_id: BuildingId;
            position: 'top' | 'underground';
        };
        'rezone-floor': {
            building_id: BuildingId;
            floor_id: FloorId;
            kind: FloorKind;
        };
        'extend-floor': {
            building_id: BuildingId;
            floor_id: FloorId;
            size_left?: uint;
            size_right?: uint;
        };
        'tick-building-time': {
            building_id: BuildingId;
            delta: number;
        };
        'start-day': {
            building_id: BuildingId;
        };
        'stop-day': {
            building_id: BuildingId;
        };
        'worker-move-start': {
            // we want a worker of this kind, whenever they are available
            building_id: BuildingId;
            worker_kind: TowerWorkerKind;
            payload: WorkerStats['payload'];
            from_position: int;
            from_floor: int;
            dest_floor: int;
            dest_position: int;
        };
        'worker-move-end': {
            building_id: BuildingId;
            worker_id: TowerWorkerId;
        }
    }
>;

export type BuildingActions = ExtendsOmit<SaveFileActions, 'building_id'>;
export type TransportActions = ExtendsOmit<BuildingActions, 'transport_id'>;
export type FloorActions = ExtendsOmit<BuildingActions, 'floor_id'>;
export type RoomActions = ExtendsOmit<FloorActions, 'room_id'>;
