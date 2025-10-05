import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { cost_to_rezone_floor } from '../logicFunctions.ts';
import type { Building } from '../types/Building.ts';
import type { Floor } from '../types/Floor.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import { as_int_or_default, type uint } from '../types/RestrictedTypes.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';

type ActionMap = {
    [p in SaveFileActions['action']]: (save_file: SaveFile, f: Extract<SaveFileActions, { action: p }>) => void;
};

const ActionMaps: ActionMap = {
    // ================================================================================================================
    // ================================================================================================================
    'add-floor'(updated, action) {
        const { building_id, position } = action;
        const building = clone_building(updated, building_id);
        const i = position === 'top' ? 0 : -1;
        const c = building.floors.at(i);
        if (!c) return;
        const floor = {
            size_left: FLOOR_DEFS.new_floor_size[0],
            size_right: FLOOR_DEFS.new_floor_size[1],
            height: as_int_or_default((i || 1) + c.height),
            kind: null,
            rooms: [],
        };
        building.floors.splice(i, 0, floor); // ok to mutate as it's already a cloned array
        const cost = cost_to_rezone_floor(floor);
        building.money = as_int_or_default(building.money - cost);
        building.top_floor = building.floors[0].height;
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-room'(updated, action) {
        const { room, building_id, floor_id } = action;
        const cost = ROOM_DEFS[room.kind].cost_to_build(room.width, room.height);
        const building = clone_building(updated, building_id);
        const floor = clone_floor(building, floor_id);
        building.money = as_int_or_default(building.money - cost);
        floor.rooms.push(room); // ok to mutate as it's already a cloned array
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-transport'(updated, action) {
        const { building_id, transport } = action;
        const building = clone_building(updated, building_id);
        building.transports.push(transport); // ok to mutate as it's already a cloned array
        const cost = TRANSPORT_DEFS[transport.kind].cost_to_build(transport.height);
        building.money = as_int_or_default(building.money - cost);
    },
    // ================================================================================================================
    // ================================================================================================================
    'extend-floor'(updated, action) {
        const { size_left = 0, size_right = 0, building_id, floor_id } = action;
        const building = clone_building(updated, building_id);
        const floor = clone_floor(building, floor_id);
        const added_floor = size_left + size_right;
        const cost = floor.kind
            ? FLOOR_DEFS.buildables[floor.kind].cost_to_build + FLOOR_DEFS.empty.cost_to_build
            : FLOOR_DEFS.empty.cost_to_build;
        building.money = as_int_or_default(building.money - cost * added_floor);
        floor.size_left = (floor.size_left + size_left) as uint;
        floor.size_right = (floor.size_right + size_right) as uint;
    },
    // ================================================================================================================
    // ================================================================================================================
    'rezone-floor'(updated, action) {
        const { kind, building_id, floor_id } = action;
        const building = clone_building(updated, building_id);
        const floor = clone_floor(building, floor_id);
        const cost = cost_to_rezone_floor(floor);
        floor.kind = kind;
        building.money = as_int_or_default(building.money - cost);
    },
    // ================================================================================================================
    // ================================================================================================================
};

export function SaveFileReducer(save_file: SaveFile, action: SaveFileActions): SaveFile {
    const updated: SaveFile = {
        buildings: [...save_file.buildings],
    };
    // @ts-expect-error
    ActionMaps[action.action](updated, action);
    return updated;
}

function clone_building(save: SaveFile, building_id: number): Building {
    const b = save.buildings[building_id];
    const clone: Building = {
        ...b,
        // have to clone the arrays here, otherwise the reducer is not idempotent
        floors: [...b.floors],
        transports: [...b.transports],
    };
    save.buildings[building_id] = clone;
    return clone;
}

function clone_floor(building: Building, floor_id: number): Floor {
    const floor = building.floors[building.top_floor - floor_id];
    const clone: Floor = {
        ...floor,
        // have to clone the arrays here, otherwise the reducer is not idempotent
        rooms: [...floor.rooms],
    };
    building.floors[building.top_floor - floor_id] = clone;
    return clone;
}
