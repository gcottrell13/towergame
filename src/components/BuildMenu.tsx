import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import { useCallback, useContext, useState } from 'react';
import {
    ConstructionContext,
    SaveFileContext,
} from '../context/stateContext.ts';

const build_menu_style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-around',
    overflowY: 'scroll',
    height: '50vh',
    padding: '10px',
    gap: '10px',
    background: 'white',
    border: '1px solid black',
    borderBottomRightRadius: '5px',
} as const;

const build_kind_select_style = {
    padding: '10px',
    borderBottom: 0,
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
} as const;

enum Menu {
    Rooms,
    Floors,
    Transportation,
}

export function BuildMenu() {
    const [current_menu, set_current_menu] = useState<Menu>(Menu.Rooms);

    const [construction, set_construction] = useContext(ConstructionContext);
    const [save] = useContext(SaveFileContext);

    const set_menu = useCallback(
        (m: Menu) => {
            set_construction(null);
            set_current_menu(m);
        },
        [set_construction],
    );

    return (
        <div style={build_menu_style}>
            <div>Money: {save.money}</div>
            {construction?.type === 'room' && ROOM_DEFS[construction.value] ? (
                <div>
                    Building: {ROOM_DEFS[construction.value].display_name}
                    <button
                        type="reset"
                        style={{ marginLeft: '5px' }}
                        onClick={() => set_construction(null)}
                    >
                        Cancel
                    </button>
                </div>
            ) : null}
            {construction?.type === 'rezone' &&
            FLOOR_DEFS.buildables[construction.value] ? (
                <div>
                    Building Floor:{' '}
                    {FLOOR_DEFS.buildables[construction.value].name}
                    <button
                        type="reset"
                        style={{ marginLeft: '5px' }}
                        onClick={() => set_construction(null)}
                    >
                        Cancel
                    </button>
                </div>
            ) : null}
            {construction?.type === 'extend' ? (
                <span>Extending floors</span>
            ) : null}

            <div>
                <button
                    style={build_kind_select_style}
                    type={'button'}
                    disabled={current_menu === Menu.Rooms}
                    onClick={() => {
                        set_menu(Menu.Rooms);
                    }}
                >
                    Rooms
                </button>
                <button
                    style={build_kind_select_style}
                    type={'button'}
                    disabled={current_menu === Menu.Floors}
                    onClick={() => {
                        set_menu(Menu.Floors);
                    }}
                >
                    Floors
                </button>
            </div>

            <span hidden={current_menu !== Menu.Rooms}>
                <RoomSelector />
            </span>
            <span hidden={current_menu !== Menu.Floors}>
                <button
                    type={'button'}
                    disabled={construction?.type === 'extend'}
                    onClick={() => {
                        set_construction({ type: 'extend' });
                    }}
                >
                    Build More Floor
                </button>
                <FloorSelector />
            </span>
        </div>
    );
}

function RoomSelector() {
    const [construction, set_construction] = useContext(ConstructionContext);
    const [save] = useContext(SaveFileContext);
    const cid = construction?.type === 'room' ? construction.value : null;
    return (
        <div className={'overflow-y-scroll'}>
            {Object.keys(ROOM_DEFS)
                .sort()
                .map((id) => {
                    const def = ROOM_DEFS[id as any];
                    return (
                        <div
                            key={id}
                            className={'first-child-grow'}
                            style={{
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span>{def.display_name}</span>
                            <img
                                src={def.sprite_empty}
                                alt={def.sprite_empty}
                            />
                            <span>${def.cost_to_build}</span>
                            <button
                                type={'button'}
                                style={{ opacity: cid === def.id ? 0 : 100 }}
                                disabled={
                                    cid === def.id ||
                                    save.money < def.cost_to_build
                                }
                                onClick={() => {
                                    set_construction({
                                        type: 'room',
                                        value: def.id,
                                    });
                                }}
                            >
                                Build
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}

function FloorSelector() {
    const [construction, set_construction] = useContext(ConstructionContext);
    const cid = construction?.type === 'rezone' ? construction.value : null;
    return (
        <div className={'overflow-y-scroll'}>
            {Object.keys(FLOOR_DEFS.buildables)
                .sort()
                .map((id) => {
                    const def = FLOOR_DEFS.buildables[id as any];
                    return (
                        <div
                            key={id}
                            className={'no-sel first-child-grow'}
                            style={{
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span>{def.name}</span>
                            <img src={def.background} alt={def.background} />
                            <span>${def.cost_to_build}/m</span>
                            <button
                                type={'button'}
                                style={{ opacity: cid === def.id ? 0 : 100 }}
                                disabled={cid === def.id}
                                onClick={() => {
                                    set_construction({
                                        type: 'rezone',
                                        value: def.id,
                                    });
                                }}
                            >
                                Build
                            </button>
                        </div>
                    );
                })}
        </div>
    );
}
