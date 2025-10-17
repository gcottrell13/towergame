import { PriorityQueue } from '@datastructures-js/priority-queue';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import type { Floor } from './Floor.ts';
import type { ResourceMap } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { SMap } from './SMap.ts';
import type { TowerWorker } from './TowerWorker.ts';
import type { Transportation } from './Transportation.ts';

/**
 * A single building representing one "franchise" or "run"
 */
export interface Building {
    name: string;
    id: uint;
    position?: int;
    floors: ReadonlyArray<Floor>;
    top_floor: int;
    max_width: uint;
    transports: Readonly<SMap<Transportation>>;

    rating: uint;
    new_things_acked: Readonly<SMap<string>>;

    action_queue: Readonly<PriorityQueue<[number, SaveFileActions]>> | null;

    /**
     * milliseconds since the building was created
     */
    time_ms: number;
    time_per_day_ms: number;
    day_started: boolean;

    /**
     * The workers that are actively moving about the building. does not include any that are inside rooms.
     */
    workers: ReadonlyArray<TowerWorker>;

    max_height: uint;
    max_depth: uint;

    bank: Readonly<ResourceMap<uint>>;
    room_id_counter: number;
}

export function Default(): Building {
    return {
        top_floor: 0 as int,
        floors: [],
        transports: {},
        max_width: 0 as uint,
        name: '',
        id: 0 as uint,
        rating: 0 as uint,
        new_things_acked: {},
        time_ms: 0,
        time_per_day_ms: 5 * 60 * 1000,
        day_started: false,
        max_height: 0 as uint,
        max_depth: 0 as uint,
        workers: [],
        action_queue: new PriorityQueue(([t]) => t),
        bank: {},
        room_id_counter: 0,
    };
}
