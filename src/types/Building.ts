import type { Floor } from './Floor.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { Transportation } from './Transportation.ts';

export interface Building {
    name: string;
    id: uint;
    position: int;
    floors: Floor[];
    top_floor: uint;
    max_width: uint;
    transports: Transportation[];
}
