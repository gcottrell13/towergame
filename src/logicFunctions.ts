import type { Building } from './types/Building.ts';
import type { Floor, FloorId } from './types/Floor.ts';
import { FLOOR_DEFS } from './types/FloorDefinition.ts';
import type { ResourceMap } from './types/ResourceDefinition.ts';
import { as_uint_or_default, type uint } from './types/RestrictedTypes.ts';
import type { Room } from './types/Room.ts';
import { ROOM_DEFS } from './types/RoomDefinition.ts';
import { TOWER_WORKER_DEFS, type TowerWorkerKind } from './types/TowerWorkerDefinition.ts';

export function cost_to_rezone_floor(floor: Floor): ResourceMap<uint> {
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;
    const size = floor.size_left + floor.size_right;
    return Object.fromEntries(
        Object.entries(floor_def.cost_to_build).map(([key, value]) => [key, as_uint_or_default((value ?? 0) * size)]),
    );
}

export function worker_pool_total(building: Building): { [p in TowerWorkerKind]: number } {
    const p: { [p in TowerWorkerKind]: number } = {};

    for (const w of Object.values(TOWER_WORKER_DEFS)) {
        for (const floor of building.floors) {
            for (const room_id of floor.room_ids) {
                const room = building.rooms[room_id];
                const prod = ROOM_DEFS[room.kind].workers_produced;
                const pk = p[w.kind];
                p[w.kind] = pk ? pk + prod[w.kind] : prod[w.kind];
            }
        }
    }
    return p;
}

export function* get_floors_from_floor(building: Building, floor_id: FloorId) {
    for (const i of counter()) {
        const a = building.floors[floor_id + i];
        if (a) yield a;
        if (i === 0) continue;
        const b = building.floors[floor_id + -i];
        if (b) yield b;
        if (!a && !b) return 'done';
    }
}

/**
 * - yields numbers
 * - returns strings
 * - can be passed in booleans
 */
function* counter(start: number = 0): Generator<number, string, boolean | undefined> {
    let i = start;
    while (true) {
        if (yield i++) {
            break;
        }
    }
    return 'done!';
}

export function workers_remaining_to_provide(room: Room): { [p: TowerWorkerKind]: uint } {
    const workers_remaining = { ...ROOM_DEFS[room.kind].workers_produced };
    for (const [, kind, amount] of room.produced_workers_committed) {
        workers_remaining[kind] = (workers_remaining[kind] - amount) as uint;
        if (workers_remaining[kind] === 0) delete workers_remaining[kind];
    }
    return workers_remaining;
}
