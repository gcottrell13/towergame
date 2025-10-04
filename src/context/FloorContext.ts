import { createContext } from 'react';
import type { Floor } from '../types/Floor.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { FloorActions } from './SaveFileContext.ts';

/**
 * Provides a floor, plus an update function. The parameter will have the building and floor context ids injected automatically.
 */
export const FloorContext = createContext<[Floor, (f: FloorActions) => void]>([
    { height: 0 as int, size_right: 0 as uint, size_left: 0 as uint, rooms: [], kind: '' as FloorKind },
    () => {},
]);
