import type { SaveFile } from '../types/SaveFile.ts';
import type { SaveFileActions } from '../context/SaveFileContext.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import { as_int_or_default, type int } from '../types/RestrictedTypes.ts';
import { cost_to_rezone_floor } from '../logicFunctions.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';

export function SaveFileReducer(
    save_file: SaveFile,
    action: SaveFileActions,
): SaveFile {
    const updated = { ...save_file };
    switch (action.type) {
        case 'buy-room': {
            const { room, building, floor } = action;
            const cost = ROOM_DEFS[room.kind].cost_to_build(
                room.width,
                room.height,
            );
            updated.money = as_int_or_default(updated.money - cost);
            building.floors[building.top_floor - floor.height] = {
                ...floor,
                rooms: [...floor.rooms, room],
            };
            break;
        }
        case 'buy-transport': {
            break;
        }
        case 'add-floor': {
            const { building, position } = action;
            const floor = {
                size_left: FLOOR_DEFS.new_floor_size[0],
                size_right: FLOOR_DEFS.new_floor_size[1],
                height:
                    position === 'top'
                        ? ((building.top_floor + 1) as int)
                        : ((building.floors[building.floors.length - 1].height -
                              1) as int),
                kind: null,
                rooms: [],
            };
            building.floors = [floor, ...building.floors];
            const cost = cost_to_rezone_floor(floor);
            updated.money = as_int_or_default(updated.money - cost);
            break;
        }
    }
    return updated;
}
