import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { RoomCategory } from '../content/room-defs.ts';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import { useConstructionContext } from '../hooks/useConstructionContext.ts';
import { FLOOR_DEFS, type FloorKind } from '../types/FloorDefinition.ts';
import { ROOM_DEFS, type RoomKind } from '../types/RoomDefinition.ts';
import { TRANSPORT_DEFS, type TransportationKind } from '../types/TransportationDefinition.ts';
import { PinSide } from './PinSide.tsx';

const build_menu_style = {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-around',
    overflowY: 'scroll',
    height: '50vh',
    padding: '10px',
    gap: '10px',
    background: 'white',
    border: '1px solid black',
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
    Transport,
    Power,
}

export function BuildMenu() {
    /// ====================================================================================================
    const [current_menu, set_current_menu] = useState<Menu>(Menu.Rooms);

    const [position, set_position] = useState<'left' | 'right'>('left');
    const [pinned, set_pinned] = useState(true);
    const [mouse_in, set_mouse_in] = useState(false);
    const [rect, set_rect] = useState<DOMRect | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const [construction, set_construction] = useConstructionContext('room', 'rezone', 'extend_floor', 'transport');
    const [save] = useContext(SaveFileContext);

    const set_menu = useCallback(
        (m: Menu) => {
            set_construction(null);
            set_current_menu(m);
        },
        [set_construction],
    );

    useEffect(() => {
        if (construction?.type !== 'room') return;
        const def = ROOM_DEFS[construction.value];
        if (save.money < def.cost_to_build(def.min_width, def.min_height)) {
            set_construction(null);
        }
    }, [construction, save.money, set_construction]);

    /// ====================================================================================================
    /// ====================================================================================================

    const select = { set_menu, current_menu };
    const pin_side = { pinned, set_pinned, set_position, position };
    let current_display = null;
    switch (construction?.type) {
        case 'room':
            current_display = `Building: ${ROOM_DEFS[construction.value].display_name}`;
            break;
        case 'rezone':
            current_display = `Building Floor: ${FLOOR_DEFS.buildables[construction.value].name}`;
            break;
        case 'transport':
            current_display = `Building: ${TRANSPORT_DEFS[construction.value].name}`;
            break;
        case 'extend_floor':
            current_display = 'Extending floors';
            break;
    }

    /// ====================================================================================================
    /// ====================================================================================================

    return (
        <div
            ref={ref}
            style={{
                ...build_menu_style,
                ...side_styles(mouse_in, position, pinned, rect, 30),
            }}
            onMouseLeave={() => {
                set_mouse_in(false);
                set_rect(ref.current?.getBoundingClientRect() ?? null);
            }}
            onMouseEnter={() => {
                set_mouse_in(true);
            }}
            className={!mouse_in && !pinned ? 'hide-content' : ''}
        >
            <PinSide {...pin_side} />
            <div>Money: {save.money}</div>
            {construction && (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {current_display}
                    <button type="reset" onClick={() => set_construction(null)}>
                        Cancel
                    </button>
                </div>
            )}

            <div>
                <SelectBuild which={Menu.Rooms} name={'Rooms'} {...select} />
                <SelectBuild which={Menu.Floors} name={'Floors'} {...select} />
                <SelectBuild which={Menu.Transport} name={'Transport'} {...select} />
            </div>

            <span hidden={current_menu !== Menu.Rooms}>
                <RoomSelector />
            </span>
            <span hidden={current_menu !== Menu.Floors}>
                <FloorSelector />
            </span>
            <span hidden={current_menu !== Menu.Transport}>
                <TransportationSelector />
            </span>
        </div>
    );
}

function RoomSelector() {
    const [construction, set_construction] = useConstructionContext('room');
    const [save] = useContext(SaveFileContext);
    return (
        <div className={'overflow-y-scroll'}>
            {Object.keys(ROOM_DEFS)
                .sort()
                .map((id) => ROOM_DEFS[id as RoomKind])
                .filter((def) => def.category === RoomCategory.Room)
                .map((def) => {
                    return (
                        <div
                            key={def.id}
                            className={'first-child-grow'}
                            style={{
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span>{def.display_name}</span>
                            <img src={def.sprite_empty} alt={def.sprite_empty} />
                            <span>${def.cost_to_build(def.min_width, def.min_height)}</span>
                            <button
                                type={'button'}
                                style={{
                                    opacity: construction?.value === def.id ? 0 : 100,
                                }}
                                disabled={
                                    construction?.value === def.id ||
                                    save.money < def.cost_to_build(def.min_width, def.min_height)
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
    const [construction, set_construction] = useConstructionContext('rezone', 'extend_floor');
    const [save] = useContext(SaveFileContext);
    const floor_kind = construction?.type === 'rezone' ? construction.value : null;
    return (
        <div className={'overflow-y-scroll'}>
            <button
                type={'button'}
                disabled={construction?.type === 'extend_floor'}
                onClick={() => {
                    set_construction({ type: 'extend_floor' });
                }}
            >
                Build More Floor
            </button>
            {Object.keys(FLOOR_DEFS.buildables)
                .sort()
                .map((id) => {
                    const def = FLOOR_DEFS.buildables[id as FloorKind];
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
                                style={{
                                    opacity: floor_kind === def.id ? 0 : 100,
                                }}
                                disabled={floor_kind === def.id || save.money < def.cost_to_build}
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

function TransportationSelector() {
    const [construction, set_construction] = useConstructionContext('transport');
    const [save] = useContext(SaveFileContext);
    return (
        <div className={'overflow-y-scroll'}>
            {Object.keys(TRANSPORT_DEFS)
                .sort()
                .map((id) => TRANSPORT_DEFS[id as TransportationKind])
                .map((def) => {
                    return (
                        <div
                            key={def.id}
                            className={'first-child-grow'}
                            style={{
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span>{def.name}</span>
                            <img src={def.sprite_empty} alt={def.sprite_empty} />
                            <span>${def.cost_per_floor(def.min_height)}</span>
                            <button
                                type={'button'}
                                style={{
                                    opacity: construction?.value === def.id ? 0 : 100,
                                }}
                                disabled={
                                    construction?.value === def.id || save.money < def.cost_per_floor(def.min_height)
                                }
                                onClick={() => {
                                    set_construction({
                                        type: 'transport',
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

function side_styles(
    mouse_in: boolean,
    position: string,
    pinned: boolean,
    rect: DOMRect | null,
    visible: number,
): React.CSSProperties {
    return {
        right:
            position === 'right' ? (mouse_in ? '0px' : `-${pinned ? 0 : (rect?.width ?? 0) - visible}px`) : undefined,
        left: position === 'left' ? (mouse_in ? '0px' : `-${pinned ? 0 : (rect?.width ?? 0) - visible}px`) : undefined,
        transition: `left 0.25s ease-out, right 0.25s ease-out`,
        borderBottomRightRadius: position === 'right' ? '' : '5px',
        borderBottomLeftRadius: position === 'left' ? '' : '5px',
    };
}

function SelectBuild({
    which,
    name,
    set_menu,
    current_menu,
}: {
    which: Menu;
    name: string;
    set_menu: (f: Menu) => void;
    current_menu: Menu;
}) {
    return (
        <button
            style={build_kind_select_style}
            type={'button'}
            disabled={current_menu === which}
            onClick={() => {
                set_menu(which);
            }}
        >
            {name}
        </button>
    );
}
