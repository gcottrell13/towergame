import { TOWER_WORKER_DEFS_RAW, type TowerWorkerDefsRaw } from '../content/tower-worker-defs.ts';
import { as_uint_or_default, type uint } from './RestrictedTypes.ts';

export type WorkerKind = string & { readonly __type: unique symbol };

export interface TowerWorkerDefinition {
    kind: WorkerKind;
    sprite: string;
    /*
    How many transports can it plan a path through.
    If the shortest available path length exceeds planning capacity, behavior is undefined.
     */
    planning_capability: uint;
}

export const TOWER_WORKER_DEFS: {
    [p: WorkerKind]: TowerWorkerDefinition;
} = Object.fromEntries(Object.entries(TOWER_WORKER_DEFS_RAW).map(([id, def]) => [id, def_from_raw(id, def)]));

function def_from_raw(id: string, raw: TowerWorkerDefsRaw): TowerWorkerDefinition {
    return {
        kind: id as WorkerKind,
        sprite: raw.sprite,
        planning_capability: as_uint_or_default(raw.planning_capability),
    };
}
