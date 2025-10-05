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
    day_number: uint;

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
        day_number: 0 as uint,
        max_height: 0 as uint,
        max_depth: 0 as uint,
    };
}
