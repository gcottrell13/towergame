import { useContext, useState } from 'react';
import { DESTROY_ROOM_COST, PIXELS_PER_UNIT } from '../constants.ts';
import { BuildingContext } from '../context/BuildingContext.ts';
import { FloorContext } from '../context/FloorContext.ts';
import { cost_to_rezone_floor } from '../logicFunctions.ts';
import { FLOOR_DEFS, type FloorKind } from '../types/FloorDefinition.ts';

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

const popover_style = {
    whiteSpace: 'nowrap',
    position: 'absolute',
    background: 'white',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '2px',
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    zIndex: 10001,
} as const;

const tag_style = {
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
} as const;

export function FloorRezoneOverlay({ floor_kind }: Props) {
    const [hovered, set_hovered] = useState(false);
    const [building] = useContext(BuildingContext);
    const [floor, update_floor] = useContext(FloorContext);
    const floor_def = FLOOR_DEFS.buildables[floor_kind];
    const cost = cost_to_rezone_floor(floor);
    const sufficient_funds = cost <= building.money;
    return (
        <div
            id={`rezone-${floor.height}`}
            className="no-sel"
            style={{
                ...style,
                width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
                left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
                background: sufficient_funds
                    ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                    : 'color-mix(in srgb, red 30%, transparent)',
            }}
            onClick={() => {
                if (!sufficient_funds) return;
                update_floor({
                    action: 'rezone-floor',
                    kind: floor_kind,
                });
            }}
            onMouseEnter={() => set_hovered(true)}
            onMouseLeave={() => set_hovered(false)}
        >
            {hovered ? (
                <span
                    style={{
                        ...popover_style,
                        right: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT + 5}px`,
                    }}
                >
                    <span>Floor {floor.height} rezone:</span>
                    <span style={{ color: 'gray' }}>
                        ($
                        {floor_def.cost_to_build}/m x {floor.size_left + floor.size_right}m)
                    </span>
                    {floor.rooms.length > 0 ? (
                        <span style={{ color: 'red' }}>
                            Destroy {floor.rooms.length} room
                            {floor.rooms.length === 1 ? '' : 's'} (+$
                            {floor.rooms.length * DESTROY_ROOM_COST})
                        </span>
                    ) : null}
                    <span
                        style={{
                            fontSize: 'x-large',
                            color: sufficient_funds ? 'green' : 'red',
                        }}
                    >
                        = ${cost}
                    </span>
                    {!sufficient_funds && <span style={{ color: 'red' }}>Insufficient Funds</span>}
                </span>
            ) : null}
            <span style={tag_style}>{floor.kind ? FLOOR_DEFS.buildables[floor.kind].name : FLOOR_DEFS.empty.name}</span>
        </div>
    );
}
