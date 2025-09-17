import type {int, uint} from "./RestrictedTypes.ts";
import type {Room} from "./Room.ts";
import type {FloorKind} from "./FloorDefinition.ts";


export interface Floor {
    height: int;
    kind: FloorKind | null;
    size_left: uint;
    size_right: uint;
    rooms: Room[];
}