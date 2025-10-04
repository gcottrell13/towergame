import type { int, uint } from './RestrictedTypes.ts';
import type { TransportationKind } from './TransportationDefinition.ts';

export interface Transportation {
    kind: TransportationKind;
    position: int;
    height: uint;
    occupancy: uint;
}
