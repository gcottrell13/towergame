import {SaveFileContext} from "../context/stateContext.ts";
import {TEST_SAVE} from "../content/test-save.ts";
import {AllBuildings} from "./AllBuildings.tsx";
import {useCallback, useState} from "react";
import type {SaveFile} from "../types/SaveFile.ts";
import {BuildMenu} from "./BuildMenu.tsx";

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
            <main>
                <AllBuildings />
                <BuildMenu />
            </main>
        </SaveFileContext.Provider>
    )
}