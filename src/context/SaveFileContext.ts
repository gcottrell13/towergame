import { createContext } from 'react';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { Default, type SaveFile } from '../types/SaveFile.ts';

export const SaveFileContext = createContext<[SaveFile, (s: SaveFileActions) => void]>([Default(), () => {}]);
