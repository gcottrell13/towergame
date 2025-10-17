import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from './constants.ts';
import type { Building } from './types/Building.ts';
import type { Floor } from './types/Floor.ts';
import { FLOOR_DEFS } from './types/FloorDefinition.ts';
import { RESOURCE_DEFS, type ResourceMap } from './types/ResourceDefinition.ts';
import { as_uint_or_default, type int, type uint } from './types/RestrictedTypes.ts';
import type { TowerWorker } from './types/TowerWorker.ts';
import { TRANSPORT_DEFS } from './types/TransportationDefinition.ts';

export function cost_to_rezone_floor(floor: Floor): ResourceMap<uint> {
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;
    const size = floor.size_left + floor.size_right;
    return Object.fromEntries(
        Object.entries(floor_def.cost_to_build).map(([key, value]) => [key, as_uint_or_default((value ?? 0) * size)]),
    );
}

export function resource_sufficient(a: ResourceMap<uint>, b: ResourceMap<uint>): boolean {
    for (const resource of Object.values(RESOURCE_DEFS)) {
        const av = a[resource.kind];
        const bv = b[resource.kind];
        if (av === undefined && bv !== undefined) return false;
        if (av !== undefined && bv !== undefined && av < bv) return false;
    }
    return true;
}

export function try_resource_subtract(bank: ResourceMap<uint>, cost: ResourceMap<uint>): ResourceMap<uint> {
    const bank_copy = { ...bank };
    for (const resource of Object.values(RESOURCE_DEFS)) {
        const av = bank_copy[resource.kind];
        const bv = cost[resource.kind];
        if (av === undefined && bv !== undefined) return bank;
        if (av !== undefined && bv !== undefined && av < bv) return bank;
        bank_copy[resource.kind] = as_uint_or_default(av! - bv!);
    }
    return bank_copy;
}

export function resources_add(a: ResourceMap<uint>, b: ResourceMap<uint>): ResourceMap<uint> {
    const sum: ResourceMap<uint> = {};
    for (const resource of Object.values(RESOURCE_DEFS)) {
        const av = a[resource.kind];
        const bv = b[resource.kind];
        if (av !== undefined && bv !== undefined) sum[resource.kind] = as_uint_or_default(av + bv);
    }
    return sum;
}
export function resources_mul(a: ResourceMap<uint>, n: number): ResourceMap<uint> {
    const sum: ResourceMap<uint> = {};
    for (const resource of Object.values(RESOURCE_DEFS)) {
        const av = a[resource.kind];
        if (av !== undefined) sum[resource.kind] = as_uint_or_default(av * n);
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
