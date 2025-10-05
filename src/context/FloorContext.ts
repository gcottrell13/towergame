import { createContext } from 'react';
import type { FloorActions } from '../events/SaveFileActions.ts';
import { Default, type Floor } from '../types/Floor.ts';

/**
 * Provides a floor, plus an update function. The parameter will have the building and floor context ids injected automatically.
 */
export const FloorContext = createContext<[Floor, (f: FloorActions) => void]>([Default(), () => {}]);
