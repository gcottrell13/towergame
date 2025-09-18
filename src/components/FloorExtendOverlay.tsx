import { useContext } from 'react';
import {
    BuildingContext,
    FloorContext,
    SaveFileContext,
} from '../context/stateContext.ts';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';

const overlay_style = {
    position: 'absolute',
    top: '0',
} as const;

export function FloorExtendOverlay() {
    const [floor, update_floor] = useContext(FloorContext);
    const [building] = useContext(BuildingContext);
    const [save, update_save] = useContext(SaveFileContext);

    const expand_left =
        (floor.height > 1
            ? building.floors[building.roof_height - floor.height + 1].size_left
            : building.max_width) - floor.size_left;
    const expand_right =
        (floor.height > 1
            ? building.floors[building.roof_height - floor.height + 1]
                  .size_right
            : building.max_width) - floor.size_right;

    let right = null;
    let left = null;

    const cost_build = floor.kind
        ? FLOOR_DEFS.buildables[floor.kind].cost_to_build +
          FLOOR_DEFS.empty.cost_to_build
        : FLOOR_DEFS.empty.cost_to_build;

    if (expand_right > 0) {
        const cost_right = cost_build * expand_right;
        const sufficient_funds = save.money >= cost_right;
        right = (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
                style={{
                    ...overlay_style,
                    right: `-${(floor.size_left + floor.size_right + expand_right) * PIXELS_PER_UNIT}px`,
                    height: `${FLOOR_HEIGHT}px`,
                    width: `${expand_right * PIXELS_PER_UNIT}px`,
                    background:
                        save.money >= cost_right
                            ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                            : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    update_floor((f) => {
                        f.size_right = (f.size_right + expand_right) as uint;
                    });
                    update_save((s) => {
                        s.money = (s.money - cost_right) as int;
                    });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                            position: 'absolute',
                            background: 'white',
                            border: '1px solid black',
                            borderRadius: '5px',
                            padding: '2px',
                            right: `${expand_right * PIXELS_PER_UNIT}px`,
                            marginTop: '3px',
                            display: 'flex',
                            gap: '5px',
                            zIndex: 10001,
                        }}
                    >
                        {!sufficient_funds && (
                            <span style={{ color: 'red' }}>
                                Insufficient Funds
                            </span>
                        )}
                        Extend Right for ${cost_right}
                    </span>
                </div>
            </div>
        );
    }
    if (expand_left > 0) {
        const cost_left = cost_build * expand_left;
        const sufficient_funds = save.money >= cost_left;
        left = (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
                style={{
                    ...overlay_style,
                    left: `-${expand_left * PIXELS_PER_UNIT}px`,
                    height: `${FLOOR_HEIGHT}px`,
                    width: `${expand_left * PIXELS_PER_UNIT}px`,
                    background:
                        save.money >= cost_left
                            ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                            : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    update_floor((f) => {
                        f.size_left = (f.size_left + expand_left) as uint;
                    });
                    update_save((s) => {
                        s.money = (s.money - cost_left) as int;
                    });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            whiteSpace: 'nowrap',
                            left: `${expand_left * PIXELS_PER_UNIT}px`,
                            position: 'absolute',
                            background: 'white',
                            border: '1px solid black',
                            borderRadius: '5px',
                            padding: '2px',
                            marginTop: '3px',
                            display: 'flex',
                            gap: '5px',
                            zIndex: 10001,
                        }}
                    >
                        {!sufficient_funds && (
                            <span style={{ color: 'red' }}>
                                Insufficient Funds
                            </span>
                        )}
                        Extend Left for ${cost_left}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            {left}
            {right}
        </>
    );
}
