import { createContext } from 'react';
import type { Floor } from '../types/Floor.ts';

export const FloorContext = createContext<Floor>({} as any);
