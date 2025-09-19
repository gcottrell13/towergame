import { useCallback, useContext } from 'react';
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

export function FloorExtendOverlay() {
    const [floor, update_floor] = useContext(FloorContext);
    const [building] = useContext(BuildingContext);
    const [save, update_save] = useContext(SaveFileContext);

    const expand_left =
        (floor.height > 1
            ? building.floors[building.top_floor - floor.height + 1].size_left
            : building.max_width) - floor.size_left;
    const expand_right =
        (floor.height > 1
            ? building.floors[building.top_floor - floor.height + 1].size_right
            : building.max_width) - floor.size_right;

    let right = null;
    let left = null;

    const cost_build = floor.kind
        ? FLOOR_DEFS.buildables[floor.kind].cost_to_build +
          FLOOR_DEFS.empty.cost_to_build
        : FLOOR_DEFS.empty.cost_to_build;

    if (expand_right > 0) {
        const cost = cost_build * expand_right;
        const sufficient_funds = save.money >= cost;
        right = (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
                style={{
                    ...overlay_style,
                    right: `-${(floor.size_right + expand_right) * PIXELS_PER_UNIT}px`,
                    height: `${FLOOR_HEIGHT}px`,
                    width: `${expand_right * PIXELS_PER_UNIT}px`,
                    background: sufficient_funds
                        ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                        : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    update_floor((f) => {
                        f.size_right = (f.size_right + expand_right) as uint;
                    });
                    update_save((s) => {
                        s.money = (s.money - cost) as int;
                    });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            ...popover_style,
                            right: `${expand_right * PIXELS_PER_UNIT}px`,
                        }}
                    >
                        {!sufficient_funds && (
                            <span style={{ color: 'red' }}>
                                Insufficient Funds
                            </span>
                        )}
                        Extend Right
                        <span style={{ color: 'gray' }}>
                            ({expand_right}m x ${cost_build}/m)
                        </span>
                        <span
                            style={{
                                fontSize: 'x-large',
                                color: sufficient_funds ? 'green' : 'red',
                            }}
                        >
                            = ${cost}
                        </span>
                    </span>
                </div>
            </div>
        );
    }
    if (expand_left > 0) {
        const cost = cost_build * expand_left;
        const sufficient_funds = save.money >= cost;
        left = (
            // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
            // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <div
                style={{
                    ...overlay_style,
                    left: `-${(expand_left + floor.size_left) * PIXELS_PER_UNIT}px`,
                    height: `${FLOOR_HEIGHT}px`,
                    width: `${expand_left * PIXELS_PER_UNIT}px`,
                    background: sufficient_funds
                        ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                        : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    update_floor((f) => {
                        f.size_left = (f.size_left + expand_left) as uint;
                    });
                    update_save((s) => {
                        s.money = (s.money - cost) as int;
                    });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            ...popover_style,
                            left: `${expand_left * PIXELS_PER_UNIT}px`,
                        }}
                    >
                        {!sufficient_funds && (
                            <span style={{ color: 'red' }}>
                                Insufficient Funds
                            </span>
                        )}
                        Extend Left
                        <span style={{ color: 'gray' }}>
                            ({expand_left}m x ${cost_build}/m)
                        </span>
                        <span
                            style={{
                                fontSize: 'x-large',
                                color: sufficient_funds ? 'green' : 'red',
                            }}
                        >
                            = ${cost}
                        </span>
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

export function NewFloorOverlay() {
    const [building, update_building] = useContext(BuildingContext);
    const [save, update_save] = useContext(SaveFileContext);
    const top_floor = building.floors[0];

    const update = useCallback(() => {
        update_building((b) => {
            b.top_floor = (b.top_floor + 1) as uint;
            const empty_floor = {
                size_left: FLOOR_DEFS.new_floor_size[0],
                size_right: FLOOR_DEFS.new_floor_size[1],
                height: (building.top_floor + 1) as int,
                kind: null,
                rooms: [],
            };
            b.floors = b.floors.toSpliced(0, 0, empty_floor);
        });
    }, [building.top_floor, update_building]);

    const size = FLOOR_DEFS.new_floor_size[0] + FLOOR_DEFS.new_floor_size[1];
    const cost = size * FLOOR_DEFS.empty.cost_to_build;
    const sufficient_funds = save.money >= cost;

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            style={{
                ...overlay_style,
                height: `${FLOOR_HEIGHT}px`,
                width: `${size * PIXELS_PER_UNIT}px`,
                background: sufficient_funds
                    ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                    : 'color-mix(in srgb, red 30%, transparent)',
                left: `${(top_floor.size_left - FLOOR_DEFS.new_floor_size[0]) * PIXELS_PER_UNIT}px`,
            }}
            className="hover-parent-display"
            onClick={() => {
                if (!sufficient_funds) return;
                update();
                update_save((s) => {
                    s.money = (s.money - cost) as int;
                });
            }}
        >
            <div className="hover-child-display no-sel">
                <span
                    style={{
                        ...popover_style,
                        top: `-${FLOOR_HEIGHT}px`,
                    }}
                >
                    {!sufficient_funds && (
                        <span style={{ color: 'red' }}>Insufficient Funds</span>
                    )}
                    New Floor
                    <span style={{ color: 'gray' }}>
                        ({size}m x ${FLOOR_DEFS.empty.cost_to_build}/m)
                    </span>
                    <span
                        style={{
                            fontSize: 'x-large',
                            color: sufficient_funds ? 'green' : 'red',
                        }}
                    >
                        = ${cost}
                    </span>
                </span>
            </div>
        </div>
    );
}
