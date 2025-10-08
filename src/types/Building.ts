import { PriorityQueue } from '@datastructures-js/priority-queue';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import type { Floor } from './Floor.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { SMap } from './SMap.ts';
import type { Transportation } from './Transportation.ts';

/**
 * A single building representing one "franchise" or "run"
 */
export interface Building {
    name: string;
    id: uint;
    position?: int;
    floors: Floor[];
    top_floor: int;
    max_width: uint;
    transports: Transportation[];

    money: int;
    rating: uint;
    new_things_acked: SMap<string>;

    action_queue: PriorityQueue<[number, SaveFileActions]> | null;

    /**
     * milliseconds since the building was created
     */
    time_ms: number;
    time_per_day_ms: number;
    day_started: boolean;

    max_height: uint;
    max_depth: uint;
}

export function Default(): Building {
    return {
        top_floor: 0 as int,
        floors: [],
        transports: [],
        max_width: 0 as uint,
        name: '',
        id: 0 as uint,
        money: 0 as int,
        rating: 0 as uint,
        new_things_acked: {},
        time_ms: 0,
        time_per_day_ms: 5 * 60 * 1000,
        day_started: false,
        max_height: 0 as uint,
        max_depth: 0 as uint,
        action_queue: new PriorityQueue(([t]) => t),
    };
}
