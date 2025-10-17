import type { SMap } from '../types/SMap.ts';
import images from './images.ts';

export const TOWER_WORKER_DEFS_RAW = {
    faceless: {
        sprite: images.FACELESS_WALK_GIF,
        planning_capability: 2,
        base_capacity: 1,
        movement_speed: 1,
    },
} satisfies SMap<TowerWorkerDefsRaw>;

export type TOWER_WORKER_KINDS = keyof typeof TOWER_WORKER_DEFS_RAW;

export interface TowerWorkerDefsRaw {
    sprite: string;
    // how many transports can it plan a path through
    planning_capability: number;
    movement_speed: number;
    base_capacity: number;
}
