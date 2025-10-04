import { useCallback, useState } from 'react';
import { TEST_SAVE } from '../content/test-save.ts';
import { type SaveFileActions, SaveFileContext } from '../context/SaveFileContext.ts';
import { SaveFileReducer } from '../reducers/SaveFileReducer.ts';
import { AllBuildings } from './AllBuildings.tsx';
import { BuildMenu } from './BuildMenu.tsx';

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
