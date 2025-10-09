import type { ResourceKind } from './ResourceDefinition.ts';
import type { int, uint } from './RestrictedTypes.ts';

export interface Worker {
    kind: string;
    current_floor: int;
    position_on_floor: int;
    payload: [ResourceKind, uint] | null;
}
