import type { SaveFileActions } from '../events/SaveFileActions.ts';
import isEmpty from 'lodash/isEmpty';
import {
    cost_to_rezone_floor,
    get_floors_from_floor,
    mapping_sufficient,
    mapping_mul,
    try_mapping_subtract,
    worker_pool_total,
    worker_spawn,
    workers_remaining_to_provide, mapping_add,
    keys,
} from '../logicFunctions.ts';
import { Default as floor_default, type Floor, type FloorId } from '../types/Floor.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import { as_int_or_default, type uint } from '../types/RestrictedTypes.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';
import {Default as room_default, type Room, type RoomId} from '../types/Room.ts';
import { PriorityQueue } from '@datastructures-js/priority-queue';
import { Default as transport_default, type Transportation, type TransportationId } from '../types/Transportation.ts';
import { TOWER_WORKER_DEFS } from '../types/TowerWorkerDefinition.ts';

type ActionMap = {
    [p in SaveFileActions['action']]: (
        save_file: SaveFile,
        f: Readonly<
            Extract<
                SaveFileActions,
                {
                    action: p;
                }
            >
        >,
        dispatch: (action: SaveFileActions) => void,
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
        const building = updated.buildings[building_id];
        const i = position === 'top' ? 0 : -1;
        const c = building.floors.at(i);
        if (!c) return;
        const floor: Floor = {
            ...floor_default(),
            size_left: FLOOR_DEFS.new_floor_size[0],
            size_right: FLOOR_DEFS.new_floor_size[1],
            height: as_int_or_default((i || 1) + c.height) as FloorId,
        };
        const cost = cost_to_rezone_floor(floor);
        if (!try_mapping_subtract(building.bank, cost, building.bank))
            return;
        building.floors.splice(i, 0, floor);
        building.top_floor = building.floors[0].height;
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-room'(updated, action) {
        const { building_id, floor_id, room } = action;
        const def = ROOM_DEFS[room.kind];
        const cost = def.cost_to_build(room.width, room.height);
        const building = updated.buildings[building_id];
        const floor = building.floors[building.top_floor - floor_id];
        if (!try_mapping_subtract(building.bank, cost, building.bank))
            return;

        const new_room = {
            ...room_default(),
            ...room,
            id: building.room_id_counter as RoomId,
        };
        floor.rooms.push(new_room);

        const workers_remaining = workers_remaining_to_provide(new_room);

        building.room_id_counter += 1;
        if (!isEmpty(def.workers_produced)) {
            // distribute workers to nearby rooms that require more workers
            for (const i of get_floors_from_floor(building, floor_id)) {
                for (const room of i.rooms) {
                    if (!mapping_sufficient(room.workers, ROOM_DEFS[room.kind].workers_required)) {
                        const missing: Room['workers'] = {};
                        if (try_mapping_subtract(ROOM_DEFS[room.kind].workers_required, room.workers, missing) && !isEmpty(missing)) {
                            for (const key of keys(missing)) {
                                if (missing[key] > 0 && workers_remaining[key] > 0) {
                                    const min = Math.min(missing[key], workers_remaining[key]) as uint;
                                    workers_remaining[key] = workers_remaining[key] - min as uint;
                                    new_room.produced_workers_committed.push([room.id, key, min]);
                                    room.workers[key] = (room.workers[key] ?? 0) + min as uint;
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    // ================================================================================================================
    // ================================================================================================================
    'buy-transport'(updated, action) {
        const { building_id, bottom_floor, height, kind, position } = action;
        const building = updated.buildings[building_id];
        const id = (Math.max(...Object.values(building.transports).map((x) => x.id)) + 1) as TransportationId;
        const transport: Transportation = {
            ...transport_default(),
            id,
            bottom_floor,
            kind,
            height,
            position,
        };
        const cost = TRANSPORT_DEFS[transport.kind].cost_to_build(transport.height);
        if (try_mapping_subtract(building.bank, cost, building.bank)) {
            building.transports[id] = transport;
        }
    },
    // ================================================================================================================
    // ================================================================================================================
    'extend-floor'(updated, action) {
        const { size_left = 0, size_right = 0, building_id, floor_id } = action;
        const building = updated.buildings[building_id];
        const floor = building.floors[building.top_floor - floor_id];
        const added_floor = size_left + size_right;
        const cost = floor.kind
            ? mapping_add(FLOOR_DEFS.buildables[floor.kind].cost_to_build, FLOOR_DEFS.empty.cost_to_build)
            : FLOOR_DEFS.empty.cost_to_build;
        if (try_mapping_subtract(building.bank, mapping_mul(cost, added_floor), building.bank)) {
            floor.size_left = (floor.size_left + size_left) as uint;
            floor.size_right = (floor.size_right + size_right) as uint;
        }
    },
    // ================================================================================================================
    // ================================================================================================================
    'rezone-floor'(updated, action) {
        const { kind, building_id, floor_id } = action;
        const building = updated.buildings[building_id];
        const floor = building.floors[building.top_floor - floor_id];
        const cost = cost_to_rezone_floor(floor);
        if (try_mapping_subtract(building.bank, cost, building.bank))
            floor.kind = kind;
    },
    // ================================================================================================================
    // ================================================================================================================
    'tick-building-time'(updated, action, dispatch) {
        const { building_id, delta } = action;
        const building = updated.buildings[building_id];
        building.time_ms = building.time_ms + delta;
        if (building.action_queue === null || building.action_queue.length === 0) return;
        const queue = PriorityQueue.fromArray(building.action_queue, (x) => x[0]);
        while (true) {
            const front = queue.front();
            if (!front || front[0] > building.time_ms) break;
            const next = queue.dequeue();
            if (next) dispatch({ ...next[1], delay_ms: 1 });
        }
        building.action_queue = queue.toArray();
    },
    // ================================================================================================================
    // ================================================================================================================
    'start-day'(updated, action, dispatch) {
        const { building_id } = action;
        const building = updated.buildings[building_id];
        building.day_started = true;
        dispatch({
            action: 'stop-day',
            building_id: building_id,
            delay_ms: building.time_per_day_ms,
        });
    },
    // ================================================================================================================
    // ================================================================================================================
    'stop-day'(updated, action) {
        const { building_id } = action;
        const building = updated.buildings[building_id];
        building.day_started = false;
        building.time_ms -= building.time_ms % building.time_per_day_ms;
    },
    // ================================================================================================================
    // ================================================================================================================
    'worker-spawn'(updated, action, dispatch) {
        // spawns a worker from their home room in order to take resources to another room.
        const { building_id, from_position, worker_kind } = action;
        const building = updated.buildings[building_id];
        const total = worker_pool_total(building);
        for (const worker of Object.values(building.workers)) {
            total[worker.kind] -= 1;
        }
        if (total[worker_kind] <= 0) {
            return dispatch({ ...action, delay_ms: 1000 });
        }
        const def = TOWER_WORKER_DEFS[worker_kind];
        const { worker_id, pnext } = worker_spawn(building, action);
        dispatch({
            action: 'worker-move-start',
            building_id,
            worker_id,
            delay_ms: (Math.abs(from_position - pnext) * 1000) / def.movement_speed,
        });
    },
    // ================================================================================================================
    // ================================================================================================================
    'worker-move-start'() {
        // add the worker into the building
    },
    'worker-move-end'() {
        // do these in order until one succeeds:
        // 1. check if reached destination; deposit resources; despawn worker and add back to room
        // 2. check if reached transportation; remove from building and add worker to transport
        // 3. despawn or attempt pathfinding to destination again
    },
    // ================================================================================================================
    // ================================================================================================================
};

export function SaveFileReducer(save_file: SaveFile, { delay_ms, ...action }: SaveFileActions) {
    if (delay_ms && 'building_id' in action) {
        insert_future_action(save_file, action.building_id, action, delay_ms);
    } else {
        ActionMaps[action.action](
            save_file,
            //@ts-expect-error
            action,
            (a) => SaveFileReducer(save_file, a),
        );
    }
}

function insert_future_action(save_file: SaveFile, building_id: number, action: SaveFileActions, delay_ms: number) {
    const building = save_file.buildings[building_id];
    if (building.action_queue === null) return;
    const time = building.time_ms + delay_ms;
    const queue = PriorityQueue.fromArray(building.action_queue, ([x]) => x);
    queue.enqueue([time, action]);
    building.action_queue = queue.toArray();
}
