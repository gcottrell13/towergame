import { createContext } from 'react';
import type { Building } from '../types/Building.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { BuildingActions } from './SaveFileContext.ts';

/**
 * Provides a building, plus an update function. The parameter will have the building context id injected automatically.
 */
export const BuildingContext = createContext<[Building, (f: BuildingActions) => void]>([
    {
        top_floor: 0 as uint,
        floors: [],
        transports: [],
        max_width: 0 as uint,
        position: 0 as int,
        name: '',
        id: 0 as uint,
    },
    () => {},
]);
