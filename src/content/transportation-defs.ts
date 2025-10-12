import type { ReactElement } from 'react';
import type { Floor } from '../types/Floor.ts';
import type { uint } from '../types/RestrictedTypes.ts';
import type { SMap } from '../types/SMap.ts';
import images from './images.ts';
import type { ResourceMapRaw } from './resource-defs.ts';

export enum TransportationType {
    Elevator,
    Stairs,
}

export const TRANSPORT_DEFS_RAW = {
    stairwell: {
        name: 'Stairwell',
        type: TransportationType.Stairs,
        sprite_empty: images.STAIRWELL1_PNG,
        max_height: 5,
        width: 1,
        cost_per_floor: { coin: 10 },
    },
    'elevator-small': {
        name: 'Small Elevator',
        type: TransportationType.Elevator,
        sprite_empty: images.STAIRWELL1_PNG,
        max_height: 15,
        width: 2,
        cost_per_floor: { coin: 20 },
        async overlay() {
            return (await import('../components/ElevatorOverlay.tsx')).ElevatorOverlay;
        },
    },
} as const satisfies SMap<TransportationDefinitionRaw>;

export interface TransportationDefinitionRaw {
    name: string;
    type: TransportationType;
    cost_per_floor: ResourceMapRaw<number> | ((height: uint) => ResourceMapRaw<uint>);
    sprite_empty: string;
    sprite_occupied?: string | null;
    min_height?: number;
    max_height: number;
    width: number;
    can_stop_at_floor?: (f: Floor) => boolean;
    tier?: number;
    overlay?: () => Promise<() => ReactElement>;
}
