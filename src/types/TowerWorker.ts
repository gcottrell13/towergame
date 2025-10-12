import type { ResourceKind } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';
import type { TowerWorkerKind } from './TowerWorkerDefinition.ts';

export interface TowerWorker {
    kind: TowerWorkerKind;
    position: [floor: int, pos: number];
    destination: [floor: int, pos: int];
    // used if the destination is on a different floor
    next_step: [floor_to_get_off: int, pos_of_transport: int] | null;
    stats: WorkerStats | null;
}

export interface WorkerStats {
    capacity: uint;
    payload: [ResourceKind, uint] | null;
    speed: number;
    status: 'working' | 'confused' | 'angry';
}

export function Default(): TowerWorker {
    return {
        kind: '' as TowerWorkerKind,
        position: [0 as int, 0],
        destination: [0 as int, 0 as int],
        next_step: null,
        stats: null,
    };
}
