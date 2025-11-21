import type { Building } from '../types/Building.ts';
import type { int } from '../types/RestrictedTypes.ts';
import type { TowerWorker } from '../types/TowerWorker.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';

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
