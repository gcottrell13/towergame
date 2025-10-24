import type { SMap } from '../types/SMap.ts';
import images from './images.ts';

export const RESOURCE_DEFS_RAW = {
    coin: {
        sprite: images.resources.COIN_PNG,
    },
} satisfies SMap<ResourceDefRaw>;

export interface ResourceDefRaw {
    sprite: string;
}

export type ResourceIds = keyof typeof RESOURCE_DEFS_RAW;
export type ResourceMapRaw<T> = Partial<{ [p in ResourceIds]: T }>;
