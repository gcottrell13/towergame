import type { TransportationKind } from './TransportationDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';

export interface Transportation {
    kind: TransportationKind;
    position: int;
    height: uint;
    occupancy: uint;
}
