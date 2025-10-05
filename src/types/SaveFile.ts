import type { Building } from './Building.ts';

/**
 * Represents the overall player's status across all play time.
 */
export interface SaveFile {
    buildings: Building[];
}

export function Default(): SaveFile {
    return {
        buildings: [],
    };
}
