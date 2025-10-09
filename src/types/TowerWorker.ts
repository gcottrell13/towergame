import type { ResourceKind } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { WorkerKind } from './TowerWorkerDefinition.ts';

export interface TowerWorker {
    kind: WorkerKind;
    position: [floor: int, pos: number];
    destination: [floor: int, pos: int];
    // used if the destination is on a different floor
    next_transport: [floor: int, pos: int] | null;
    stats: WorkerStats | null;
}

export interface WorkerStats {
    capacity: uint;
    payload: [ResourceKind, uint] | null;
    speed: number;
}

export function Default(): TowerWorker {
    return {
        kind: '' as WorkerKind,
        position: [0 as int, 0],
        destination: [0 as int, 0 as int],
        next_transport: null,
        stats: null,
    };
}
