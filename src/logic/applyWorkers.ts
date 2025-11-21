import isEmpty from 'lodash/isEmpty';
import { keys } from '../betterObjectFunctions.ts';
import { workers_remaining_to_provide } from '../logicFunctions.ts';
import type { uint } from '../types/RestrictedTypes.ts';
import type { Room } from '../types/Room.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import type { TowerWorkerKind } from '../types/TowerWorkerDefinition.ts';
import { mapping_sufficient, try_mapping_subtract } from './mappingComparison.ts';

/**
 * Returns iterator of rooms that were fulfilled by this operation
 * @param producers
 * @param consumers
 */
export function* apply_workers(producers: Iterable<Room>, consumers: Iterable<Room>) {
    for (const producer of producers) {
        const def = ROOM_DEFS[producer.kind];
        const workers_remaining = workers_remaining_to_provide(producer);
        const committed: { [p: TowerWorkerKind]: uint } = Object.fromEntries(
            producer.produced_workers_committed.map(([, key, v]) => [key, v]),
        );
        if (mapping_sufficient(committed, def.workers_produced)) continue; // skip to next producer room
        // distribute workers to nearby rooms that require more workers
        for (const consumer of consumers) {
            if (!mapping_sufficient(consumer.workers, ROOM_DEFS[consumer.kind].workers_required)) {
                const missing: Room['workers'] = {};
                // only operate on rooms that require workers
                if (
                    try_mapping_subtract(ROOM_DEFS[consumer.kind].workers_required, consumer.workers, missing) &&
                    !isEmpty(missing)
                ) {
                    // fill workers
                    for (const key of keys(missing)) {
                        if (missing[key] > 0 && workers_remaining[key] > 0) {
                            const min = Math.min(missing[key], workers_remaining[key]) as uint;
                            workers_remaining[key] = (workers_remaining[key] - min) as uint;
                            producer.produced_workers_committed.push([consumer.id, key, min]);
                            consumer.workers[key] = ((consumer.workers[key] ?? 0) + min) as uint;
                        }
                    }
                    // now test if the consumer room is full
                    if (
                        try_mapping_subtract(ROOM_DEFS[consumer.kind].workers_required, consumer.workers, missing) &&
                        isEmpty(missing)
                    ) {
                        yield consumer;
                    }
                }
            }
        }
    }
}
