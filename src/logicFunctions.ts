import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from './constants.ts';
import merge from 'lodash/merge';
import type { SaveFileActions } from './events/SaveFileActions.ts';
import type { Building } from './types/Building.ts';
import type { Floor, FloorId } from './types/Floor.ts';
import { FLOOR_DEFS } from './types/FloorDefinition.ts';
import { type ResourceMap } from './types/ResourceDefinition.ts';
import { as_uint_or_default, type int, type uint } from './types/RestrictedTypes.ts';
import { ROOM_DEFS } from './types/RoomDefinition.ts';
import type { TowerWorker, TowerWorkerId } from './types/TowerWorker.ts';
import { TOWER_WORKER_DEFS, type TowerWorkerKind } from './types/TowerWorkerDefinition.ts';
import { TRANSPORT_DEFS } from './types/TransportationDefinition.ts';
import type { Room } from './types/Room.ts';

// a hack to get the proper keys
export const keys: <T extends {[p in string]: any}>(obj: T) => (keyof T)[] = Object.keys;
export const entries: <T extends {[p in string]: any}>(obj: T) => [key: keyof T, value: T[keyof T]][] = Object.entries;

export function cost_to_rezone_floor(floor: Floor): ResourceMap<uint> {
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;
    const size = floor.size_left + floor.size_right;
    return Object.fromEntries(
        Object.entries(floor_def.cost_to_build).map(([key, value]) => [key, as_uint_or_default((value ?? 0) * size)]),
    );
}

export function mapping_sufficient<O extends {[p: string]: number}>(
    value: O,
    target: O,
): boolean {
    for (const key in target) {
        const av = value[key];
        const bv = target[key];
        if (av === undefined) return false;
        if (av < bv) return false;
    }
    return true;
}

export function try_mapping_subtract<O extends {[p: string]: number}>(
    source: O,
    target: O,
    output: O,
): boolean {
    const source_copy = { ...source };
    for (const key in target) {
        const av = source_copy[key];
        const bv = target[key];
        if (av === undefined && bv !== undefined) return false;
        if (av !== undefined && bv !== undefined && av < bv) return false;
        source_copy[key] = av! - bv! as O[Extract<keyof O, string>];
    }
    merge(output, source_copy);
    return true;
}

export function mapping_add<O extends {[p: string]: number}>(
    a: O,
    b: O,
): O {
    const sum: O = { ...a };
    for (const key in b) {
        const av = a[key];
        const bv = b[key];
        if (av !== undefined) sum[key] = (av + bv) as O[Extract<keyof O, string>];
        else sum[key] = bv;
    }
    return sum;
}

export function mapping_mul<O extends {[p: string]: number}>(
    a: O,
    n: number,
): O {
    const sum: O = { ...a };
    for (const resource in a) {
        const av = a[resource];
        if (av !== undefined) sum[resource] = (av * n) as O[Extract<keyof O, string>];
    }
    return sum;
}

/**
 * ``` `${(units ?? 0) * PIXELS_PER_UNIT + plus}px`; ```
 * @param units
 * @param plus
 */
export function hori(units: number | undefined | null, plus: number = 0) {
    return `${(units ?? 0) * PIXELS_PER_UNIT + plus}px`;
}

/**
 * ``` `${(units ?? 0) * FLOOR_HEIGHT + plus}px`; ```
 * @param units
 * @param plus
 */
export function verti(units: number | undefined | null, plus: number = 0) {
    return `${(units ?? 0) * FLOOR_HEIGHT + plus}px`;
}

type P = NonNullable<TowerWorker['next_step']>;

export function pathfind_worker_next_step(
    from: readonly [floor: int, pos: int],
    [dest_floor, dest_pos]: [floor: int, pos: int],
    building: Building,
    max_steps: number,
): P {
    // needs to take distances into account
    if (from[0] === dest_floor) return [dest_floor, dest_pos];
    const visited_floors = new Set();
    visited_floors.add(from[0]);
    const frontier: [number, P[]][] = [[0, [[...from]]]];
    let fallback: Readonly<P> = from;
    let has_fallback = false;
    const fallback_floors = [];

    while (frontier.length > 0) {
        const s = frontier.shift();
        if (!s) break;
        const [l, [[floor_id, pos_id], ...init]] = s;
        if (l > max_steps) continue;
        if (floor_id === dest_floor) return init.at(-1) ?? [...fallback];
        const floor = building.floors[building.top_floor - floor_id];
        for (const b of Object.values(building.transports)) {
            const def = TRANSPORT_DEFS[b.kind];
            if (!def) continue;
            const reaches_this_floor = b.bottom_floor < floor_id && b.height + b.bottom_floor > floor_id;
            const stops_at_this_floor = def.can_stop_at_floor(floor);
            if (!reaches_this_floor || !stops_at_this_floor) break;
            for (let i = 0; i < b.height; i++) {
                const f = i + b.bottom_floor;
                if (!visited_floors.has(f) && def.can_stop_at_floor(building.floors[building.top_floor - f])) {
                    visited_floors.add(f);
                    frontier.push([l + 1, [[f as int, b.position], [floor_id, pos_id], ...init]]);
                    if (!has_fallback) {
                        fallback_floors.push([f as int, b.position] as const);
                    }
                }
            }
        }

        if (!has_fallback) {
            fallback = fallback_floors[Math.floor(Math.random() * fallback_floors.length)];
            has_fallback = true;
        }
    }
    return [...fallback];
}

export function worker_pool_total(building: Building): { [p in TowerWorkerKind]: number } {
    const p: { [p in TowerWorkerKind]: number } = {};

    for (const w of Object.values(TOWER_WORKER_DEFS)) {
        for (const floor of building.floors) {
            for (const room of floor.rooms) {
                const prod = ROOM_DEFS[room.kind].workers_produced;
                const pk = p[w.kind];
                p[w.kind] = pk ? pk + prod[w.kind] : prod[w.kind];
            }
        }
    }
    return p;
}

export function worker_spawn(
    building: Building,
    {
        dest_floor,
        dest_position,
        from_floor,
        payload,
        worker_kind,
        from_position,
    }: Extract<SaveFileActions, { action: 'worker-spawn' }>,
) {
    const def = TOWER_WORKER_DEFS[worker_kind];
    const [fnext, pnext] = pathfind_worker_next_step(
        [from_floor, from_position],
        [dest_floor, dest_position],
        building,
        def.planning_capability,
    );
    const worker_id = (building.worker_id_counter + 1) as TowerWorkerId;
    building.worker_id_counter = worker_id;
    const workers = { ...building.workers };
    building.workers = workers;
    workers[worker_id] = {
        id: worker_id,
        kind: worker_kind,
        position: [from_floor, from_position],
        destination: [dest_floor, dest_position],
        next_step: [fnext, pnext],
        stats: {
            capacity: def.base_capacity,
            payload,
            speed: def.movement_speed,
            status: 'working',
        },
    };
    return { worker_id, pnext };
}

export function* get_floors_from_floor(building: Building, floor_id: FloorId) {
    for (const i of counter()) {
        const a = building.floors[floor_id + i];
        if (a) yield a;
        if (i === 0)
            continue;
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
