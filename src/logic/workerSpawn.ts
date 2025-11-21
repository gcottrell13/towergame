import type { SaveFileActions } from '../events/SaveFileActions.ts';
import type { Building } from '../types/Building.ts';
import type { TowerWorkerId } from '../types/TowerWorker.ts';
import { TOWER_WORKER_DEFS } from '../types/TowerWorkerDefinition.ts';
import { pathfind_worker_next_step } from './workerPathfind.ts';

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
