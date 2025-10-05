import { createContext } from 'react';
import type { Dispatch } from '../types/dispatch.ts';
import {Default, type SaveFile} from '../types/SaveFile.ts';
import type {SaveFileActions} from "../events/SaveFileActions.ts";


export const SaveFileContext = createContext<[SaveFile, Dispatch<SaveFileActions>]>([
    Default(),
    () => {},
]);
