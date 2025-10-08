import { createContext } from 'react';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import type { Dispatch } from '../types/dispatch.ts';
import { Default, type SaveFile } from '../types/SaveFile.ts';

export const SaveFileContext = createContext<[SaveFile, Dispatch<[SaveFileActions, number]>]>([Default(), () => {}]);
