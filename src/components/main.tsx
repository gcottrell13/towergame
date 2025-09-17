import {BuildingRoomContext, FloorRezoneContext, SaveFileContext} from "../context/stateContext.ts";
import {TEST_SAVE} from "../content/test_save.ts";
import {AllBuildings} from "./AllBuildings.tsx";
import {useCallback, useState} from "react";
import type {SaveFile} from "../types/SaveFile.ts";
import type {RoomKind} from "../types/RoomDefinition.ts";
import type {FloorKind} from "../types/FloorDefinition.ts";

export function Main() {
    const [state, setState] = useState(TEST_SAVE);
    const setStateUpdate = useCallback(
        (f: (s: SaveFile) => void) => {
            setState(c => {
                const new_item = {...c};
                f(new_item);
                return new_item;
            })
        },
        [],
    );

    return (
        <SaveFileContext.Provider value={[
            state,
            setStateUpdate,
        ]}>
            <BuildingRoomContext.Provider value={useState<RoomKind | null>(null)}>
                <FloorRezoneContext.Provider value={useState<FloorKind | null>(null)}>
                    <main>
                        <AllBuildings />
                    </main>
                </FloorRezoneContext.Provider>
            </BuildingRoomContext.Provider>
        </SaveFileContext.Provider>
    )
}