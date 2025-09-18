import { FLOOR_DEFS, type FloorKind } from '../types/FloorDefinition.ts';
import { useContext, useState } from 'react';
import { FloorContext } from '../context/stateContext.ts';
import { PIXELS_PER_UNIT } from '../constants.ts';

interface Props {
    floor_kind: FloorKind;
}

const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    background: 'color-mix(in srgb, lawngreen 30%, transparent)',
    zIndex: 10000,
} as const;

export function FloorRezoneOverlay({ floor_kind }: Props) {
    const [hovered, set_hovered] = useState(false);
    const [floor, update_floor] = useContext(FloorContext);
    const floor_def = FLOOR_DEFS.buildables[floor_kind];
    const cost = (floor.size_left + floor.size_right) * floor_def.cost_to_build;
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: clicky
        // biome-ignore lint/a11y/useKeyWithClickEvents: no keys
        <div
            id={`rezone-${floor.height}`}
            className="no-sel"
            style={{
                ...style,
                width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
            }}
            onClick={() => {
                update_floor((f) => {
                    f.kind = floor_kind;
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
                    }}
                >
                    Floor {floor.height} rezone: ${cost}
                    <span style={{ color: 'gray', marginLeft: '5px' }}>
                        ($
                        {floor_def.cost_to_build}/m *{' '}
                        {floor.size_left + floor.size_right}m)
                    </span>
                </span>
            ) : null}
        </div>
    );
}
