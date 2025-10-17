import type { DiscriminatedUnion } from './DiscriminatedUnion.ts';
import type { ResourceKind } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { RoomKind } from './RoomDefinition.ts';
import type { TowerWorker } from './TowerWorker.ts';

export type RoomId = number & { readonly __type: unique symbol };

export type RoomState = DiscriminatedUnion<
    'type',
    {
        Basic: { occupied: boolean };
        WaitingForResources: {
            // resources that have not been delivered, nor scheduled for delivery. If this is empty, then all inputs
            // are accounted for, but may not be delivered yet.
            needs: { [p: ResourceKind]: uint };
            // used to determine priority for delivery
            waiting_since: uint;
        };
    }
>;

export interface Room {
    id: RoomId;
    position: int;
    kind: RoomKind;
    state: RoomState | null;
    bottom_floor: int;
    height: uint;
    width: uint;
    total_resources_produced: Readonly<{
        [p: ResourceKind]: uint;
    }>;
    workers: ReadonlyArray<TowerWorker>;
    storage: Readonly<{ [p: ResourceKind]: uint }>;

    // precalculated list of rooms to send outputs to
    output_destinations: ReadonlyArray<RoomId>;
    output_priorities: Readonly<{ [p: RoomId]: 'prioritize' | 'never' }>;
}

export function Default(): Room {
    return {
        id: 0 as RoomId,
        total_resources_produced: {},
        kind: '' as RoomKind,
        position: 0 as int,
        state: null,
        width: 0 as uint,
        height: 0 as uint,
        bottom_floor: 0 as int,
        workers: [],
        storage: {},
        output_priorities: {},
        output_destinations: [],
    };
}
