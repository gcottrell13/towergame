import type {int, uint} from "./RestrictedTypes.ts";
import type {Floor} from "./Floor.ts";


export interface Building {
    name: string;
    id: uint;
    position: int;
    floors: Floor[];
    roof_height: uint;
    max_width: uint;
}