import type { BUILDABLE_FLOOR_KINDS } from './floor-defs.ts';
import type { SMap } from '../types/SMap.ts';
import images from './images.ts';
import type { ReactElement } from 'react';

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
        cost_per_floor: 10,
    },
    'elevator-small': {
        name: 'Small Elevator',
        type: TransportationType.Elevator,
        sprite_empty: images.STAIRWELL1_PNG,
        max_height: 15,
        width: 2,
        cost_per_floor: 20,
        async overlay() {
            return (await import('../components/ElevatorOverlay.tsx'))
                .ElevatorOverlay;
        },
    },
} as const satisfies SMap<TransportationDefinitionRaw>;

export interface TransportationDefinitionRaw {
    name: string;
    type: TransportationType;
    cost_per_floor: number;
    sprite_empty: string;
    sprite_occupied?: string | null;
    min_height?: number;
    max_height: number;
    width: number;
    stops_floor_kind?: BUILDABLE_FLOOR_KINDS;
    tier?: number;
    overlay?: () => Promise<() => ReactElement>;
}
