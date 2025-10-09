import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { cost_to_rezone_floor } from '../logicFunctions.ts';
import type { Building } from '../types/Building.ts';
import { Default as floor_default, type Floor } from '../types/Floor.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import { as_int_or_default, type uint } from '../types/RestrictedTypes.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';
import type { Dispatch } from '../types/dispatch.ts';
import { Default as room_default } from '../types/Room.ts';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import type {Transportation} from "../types/Transportation.ts";

type ActionMap = {
    [p in SaveFileActions['action']]: (
        save_file: SaveFile,
        f: Extract<
            SaveFileActions,
            {
                action: p;
            }
        >,
        dispatch: Dispatch<[SaveFileActions, number]>,
    ) => void;
};

const ActionMaps: ActionMap = {
    // ================================================================================================================
    // ================================================================================================================
    'buy-perm-upgrade'() {},
    // ================================================================================================================
    // ================================================================================================================
    'add-floor'(updated, action) {
        const { building_id, position } = action;
        const building = clone_building(updated, building_id);
        const i = position === 'top' ? 0 : -1;
        const c = building.floors.at(i);
        if (!c) return;
        const floor: Floor = {
            ...floor_default(),
            size_left: FLOOR_DEFS.new_floor_size[0],
            size_right: FLOOR_DEFS.new_floor_size[1],
            height: as_int_or_default((i || 1) + c.height),
        };
        building.floors.splice(i, 0, floor); // ok to mutate as it's already a cloned array
        const cost = cost_to_rezone_floor(floor);
        building.money = as_int_or_default(building.money - cost);
        building.top_floor = building.floors[0].height;
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-room'(updated, action) {
        const { building_id, floor_id, room } = action;
        const cost = ROOM_DEFS[room.kind].cost_to_build(room.width, room.height);
        const building = clone_building(updated, building_id);
        const floor = clone_floor(building, floor_id);
        building.money = as_int_or_default(building.money - cost);
        floor.rooms.push({
            ...room_default(),
            ...room,
        }); // ok to mutate as it's already a cloned array
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-transport'(updated, action) {
        const { building_id, bottom_floor, height, kind, position } = action;
        const building = clone_building(updated, building_id);
        const id = Math.max(...Object.values(building.transports).map(x => x.id)) + 1;
        const transport: Transportation = {
            id,
            bottom_floor,
            kind,
            height,
            position,
            occupancy: [],
            name: "",
        };
        building.transports[id] = transport; // ok to mutate as it's already a cloned array
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
    'tick-building-time'(updated, action, dispatch) {
        const { building_id, delta } = action;
        const building = clone_building(updated, building_id);
        building.time_ms = building.time_ms + delta;
        if (building.action_queue === null || building.action_queue.front() === null) return;
        building.action_queue = PriorityQueue.fromArray(building.action_queue.toArray(), ([x]) => x); // clone it
        while (true) {
            const front = building.action_queue.front();
            if (!front || front[0] > building.time_ms) return;
            const next = building.action_queue.dequeue();
            if (next) dispatch(next[1], 0);
        }
    },
    // ================================================================================================================
    // ================================================================================================================
    'start-day'(updated, action, dispatch) {
        const { building_id } = action;
        const building = clone_building(updated, building_id);
        building.day_started = true;
        dispatch(
            {
                action: 'stop-day',
                building_id: building_id,
            },
            building.time_per_day_ms,
        );
    },
    // ================================================================================================================
    // ================================================================================================================
    'stop-day'(updated, action) {
        const { building_id } = action;
        const building = clone_building(updated, building_id);
        building.day_started = false;
        building.time_ms -= building.time_ms % building.time_per_day_ms;
    },
    // ================================================================================================================
    // ================================================================================================================
};

export function SaveFileReducer(save_file: SaveFile, action: SaveFileActions, delay_ms: number): SaveFile {
    const updated: SaveFile = {
        buildings: [...save_file.buildings],
    };
    return reduce(updated, action, delay_ms);
}

function reduce(updated: SaveFile, action: SaveFileActions, delay_ms: number): SaveFile {
    if (delay_ms > 0 && 'building_id' in action) {
        insert_future_action(updated, action.building_id, action, delay_ms);
        return updated;
    }
    ActionMaps[action.action](
        updated,
        //@ts-expect-error
        action,
        (a, delay_ms2: number = 0) => reduce(updated, a, delay_ms2),
    );
    return updated;
}

function clone_building(save: SaveFile, building_id: number): Building {
    const b = save.buildings[building_id];
    const clone: Building = {
        ...b,
        // have to clone the arrays here, otherwise the reducer is not idempotent
        floors: [...b.floors],
        transports: {...b.transports},
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

function insert_future_action(updated: SaveFile, building_id: number, action: SaveFileActions, delay_ms: number) {
    const building = clone_building(updated, building_id);
    if (building.action_queue === null) return;
    const time = building.time_ms + delay_ms;
    building.action_queue = PriorityQueue.fromArray(building.action_queue.toArray(), ([x]) => x); // clone it
    building.action_queue.enqueue([time, action]); // ok to mutate as it's already a cloned array
}
