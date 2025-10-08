import type { SMap } from '../types/SMap.ts';
import images from './images.ts';

export const RESOURCE_DEFS_RAW = {
    coin: {
        sprite: images.STAIRWELL1_PNG,
    },
} satisfies SMap<ResourceDefRaw>;

export interface ResourceDefRaw {
    sprite: string;
}

export type ResourceIds = keyof typeof RESOURCE_DEFS_RAW;
