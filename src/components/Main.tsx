import { useCallback, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { TEST_SAVE } from '../content/test-save.ts';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import type { SaveFileActions } from '../events/SaveFileActions.ts';
import { useConstructionContext } from '../hooks/useConstructionContext.ts';
import { useSelectedRoom } from '../hooks/useSelectedRoom.ts';
import { SaveFileReducer } from '../reducers/SaveFileReducer.ts';
import type { SaveFile } from '../types/SaveFile.ts';
import { AllBuildings } from './AllBuildings.tsx';
import type { BuildingId } from '../types/Building.ts';
import type { uint } from '../types/RestrictedTypes.ts';

interface Props {
    allow_right_click: boolean;
}

export function Main({ allow_right_click }: Props) {
    const [state, dispatch] = useImmerReducer<SaveFile, SaveFileActions>(SaveFileReducer, TEST_SAVE);

    useEffect(() => {
        // TODO: Remove this
        dispatch({ action: 'increase-tier', building_id: 0 as BuildingId, tier: 0 as uint });
    }, []);

    const [, set_construction] = useConstructionContext.all();
    const [, set_selected_room] = useSelectedRoom.all();

    const cancel_construction = useCallback(
        (ev: React.MouseEvent) => {
            if (!allow_right_click) {
                ev.preventDefault();
                set_construction(null);
                set_selected_room(null);
            }
        },
        [set_construction, set_selected_room, allow_right_click],
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
