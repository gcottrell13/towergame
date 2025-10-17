import type { int, uint } from './RestrictedTypes.ts';
import type { TowerWorker } from './TowerWorker.ts';
import type { TransportationKind } from './TransportationDefinition.ts';

export interface Transportation {
    kind: TransportationKind;
    name?: string;
    id: number;
    position: int;
    bottom_floor: int;
    height: uint;
    occupancy: ReadonlyArray<TowerWorker>;
}

export function Default(): Transportation {
    return {
        kind: '' as TransportationKind,
        name: '',
        id: 0,
        position: 0 as int,
        bottom_floor: 0 as int,
        height: 0 as uint,
        occupancy: [],
    };
}
