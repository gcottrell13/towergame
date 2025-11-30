import type { Building } from './Building.ts';
import type { ResourceMap } from './ResourceDefinition.ts';
import type { uint } from './RestrictedTypes.ts';

/**
 * Represents the overall player's status across all play time.
 */
export interface SaveFile {
    buildings: Building[];
    wallet: ResourceMap<uint>;
}

export function Default(items?: Partial<SaveFile>): SaveFile {
    return {
        buildings: [],
        wallet: {},
        ...items,
    };
}
