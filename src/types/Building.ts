import type { int, uint } from './RestrictedTypes.ts';
import type { Floor } from './Floor.ts';

export interface Building {
    name: string;
    id: uint;
    position: int;
    floors: Floor[];
    top_floor: uint;
    max_width: uint;
}
