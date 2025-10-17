import { useCallback, useState } from 'react';
import { TEST_SAVE } from '../content/test-save.ts';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { SaveFileReducer } from '../reducers/SaveFileReducer.ts';
import { AllBuildings } from './AllBuildings.tsx';

export function Main() {
    const [state, setState] = useState(TEST_SAVE);
    const setStateUpdate = useCallback((action: SaveFileActions, delay_ms: number = 0) => {
        setState((current) => {
            return SaveFileReducer(current, action, delay_ms);
        });
    }, []);

    return (
        <SaveFileContext value={[state, setStateUpdate]}>
            <main>
                <AllBuildings />
            </main>
        </SaveFileContext>
    );
}
