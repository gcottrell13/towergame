import { createContext } from 'react';
import type { BuildingActions } from '../events/SaveFileActions.ts';
import { type Building, Default } from '../types/Building.ts';

/**
 * Provides a building, plus an update function. The parameter will have the building context id injected automatically.
 */
export const BuildingContext = createContext<[Building, (f: BuildingActions) => void]>([Default(), () => {}]);
