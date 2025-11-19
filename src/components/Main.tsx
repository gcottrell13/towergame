import { useCallback } from 'react';
import { useImmerReducer } from 'use-immer';
import { TEST_SAVE } from '../content/test-save.ts';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { useConstructionContext } from '../hooks/useConstructionContext.ts';
import { useSelectedRoom } from '../hooks/useSelectedRoom.ts';
import { SaveFileReducer } from '../reducers/SaveFileReducer.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import { AllBuildings } from './AllBuildings.tsx';

export function Main() {
    const [state, dispatch] = useImmerReducer<SaveFile, SaveFileActions>(SaveFileReducer, TEST_SAVE);

    const [, set_construction] = useConstructionContext();
    const [, set_selected_room] = useSelectedRoom();

    const cancel_construction = useCallback(
        (ev: React.MouseEvent) => {
            ev.preventDefault();
            set_construction(null);
            set_selected_room(null);
        },
        [set_construction, set_selected_room],
    );

    return (
        <SaveFileContext value={[state, dispatch]}>
            <main onContextMenu={cancel_construction}>
                <StaticBg onContextMenu={cancel_construction} />
                <AllBuildings />
            </main>
        </SaveFileContext>
    );
}

function StaticBg({ onContextMenu }: { onContextMenu?: React.MouseEventHandler<HTMLDivElement> }) {
    return <div className={'static-bg'} onContextMenu={onContextMenu}></div>;
}
