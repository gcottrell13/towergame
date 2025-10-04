import { createContext } from 'react';
import type { Floor } from '../types/Floor.ts';
import type { FloorActions } from './SaveFileContext.ts';

/**
 * Provides a floor, plus an update function. The parameter will have the building and floor context ids injected automatically.
 */
export const FloorContext = createContext<[Floor, (f: FloorActions) => void]>([] as any);
