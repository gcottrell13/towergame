import { FLOOR_DEFS, type FloorKind } from '../types/FloorDefinition.ts';
import { useContext, useState } from 'react';
import { FloorContext, SaveFileContext } from '../context/stateContext.ts';
import { DESTROY_ROOM_COST, PIXELS_PER_UNIT } from '../constants.ts';
import type { int } from '../types/RestrictedTypes.ts';

interface Props {
    floor_kind: FloorKind;
}

const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    zIndex: 10000,
} as const;

export function FloorRezoneOverlay({ floor_kind }: Props) {
    const [hovered, set_hovered] = useState(false);
    const [save, update_save] = useContext(SaveFileContext);
    const [floor, update_floor] = useContext(FloorContext);
    const floor_def = FLOOR_DEFS.buildables[floor_kind];
    const cost =
        (floor.size_left + floor.size_right) * floor_def.cost_to_build +
        floor.rooms.length * DESTROY_ROOM_COST;
    const sufficient_funds = cost <= save.money;
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: clicky
        // biome-ignore lint/a11y/useKeyWithClickEvents: no keys
        <div
            id={`rezone-${floor.height}`}
            className="no-sel"
            style={{
                ...style,
                width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
                background: sufficient_funds
                    ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                    : 'color-mix(in srgb, red 30%, transparent)',
            }}
            onClick={() => {
                if (!sufficient_funds) return;
                update_floor((f) => {
                    f.kind = floor_kind;
                    f.rooms = [];
                });
                update_save((s) => {
                    s.money = (s.money - cost) as int;
                });
            }}
            onMouseEnter={() => set_hovered(true)}
            onMouseLeave={() => set_hovered(false)}
        >
            {hovered ? (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        position: 'absolute',
                        background: 'white',
                        border: '1px solid black',
                        borderRadius: '5px',
                        padding: '2px',
                        right: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT + 5}px`,
                        marginTop: '3px',
                        display: 'flex',
                        gap: '5px',
                    }}
                >
                    {!sufficient_funds && (
                        <span style={{ color: 'red' }}>Insufficient Funds</span>
                    )}
                    <span>
                        Floor {floor.height} rezone: ${cost}
                    </span>
                    <span style={{ color: 'gray' }}>
                        ($
                        {floor_def.cost_to_build}/m *{' '}
                        {floor.size_left + floor.size_right}m)
                    </span>
                    {floor.rooms.length > 0 ? (
                        <span style={{ color: 'red' }}>
                            Destroy {floor.rooms.length} room
                            {floor.rooms.length === 1 ? '' : 's'} (+$
                            {floor.rooms.length * DESTROY_ROOM_COST})
                        </span>
                    ) : null}
                </span>
            ) : null}
            <span
                style={{
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    background: 'white',
                    border: '1px solid black',
                    borderRadius: '5px',
                    padding: '2px',
                    left: '2px',
                    marginTop: '3px',
                    display: 'flex',
                    gap: '5px',
                }}
            >
                {floor.kind
                    ? FLOOR_DEFS.buildables[floor.kind].name
                    : FLOOR_DEFS.empty.name}
            </span>
        </div>
    );
}
