import {
    type SaveFileActions,
    SaveFileContext,
} from '../context/SaveFileContext.ts';
import { TEST_SAVE } from '../content/test-save.ts';
import { AllBuildings } from './AllBuildings.tsx';
import { useCallback, useState } from 'react';
import { BuildMenu } from './BuildMenu.tsx';
import { SaveFileReducer } from '../reducers/SaveFileReducer.ts';

export function Main() {
    const [state, setState] = useState(TEST_SAVE);
    const setStateUpdate = useCallback((action: SaveFileActions) => {
        setState((current) => SaveFileReducer(current, action));
    }, []);

    return (
        <SaveFileContext.Provider value={[state, setStateUpdate]}>
            <main>
                <AllBuildings />
                <BuildMenu />
            </main>
        </SaveFileContext.Provider>
    );
}
