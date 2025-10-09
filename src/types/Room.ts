import type { DiscriminatedUnion } from './DiscriminatedUnion.ts';
import type { ResourceKind } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { RoomKind } from './RoomDefinition.ts';
import type {TowerWorker} from "./TowerWorker.ts";

export type RoomState = DiscriminatedUnion<
    'type',
    {
        Basic: { occupied: boolean };
        WaitingForResources: {
            needs: { [p: ResourceKind]: uint };
        };
    }
>;

export interface Room {
    // also the id
    position: int;
    kind: RoomKind;
    state: RoomState | null;
    bottom_floor: int;
    height: uint;
    width: uint;
    total_resources_produced: {
        [p: ResourceKind]: uint;
    };
    workers: TowerWorker[];
}

export function Default(): Room {
    return {
        total_resources_produced: {},
        kind: '' as RoomKind,
        position: 0 as int,
        state: null,
        width: 0 as uint,
        height: 0 as uint,
        bottom_floor: 0 as int,
        workers: [],
    };
}
