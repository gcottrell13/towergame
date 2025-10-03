import { createContext } from 'react';
import type { Building } from '../types/Building.ts';

export const BuildingContext = createContext<Building>({} as any);
