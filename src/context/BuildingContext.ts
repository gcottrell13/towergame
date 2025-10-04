import { createContext } from 'react';
import type { Building } from '../types/Building.ts';
import type { BuildingActions } from './SaveFileContext.ts';

/**
 * Provides a building, plus an update function. The parameter will have the building context id injected automatically.
 */
export const BuildingContext = createContext<[Building, (f: BuildingActions) => void]>([] as any);
