import { useCallback, useContext } from 'react';
import { BuildingContext } from '../context/BuildingContext.ts';
import { FloorContext } from '../context/FloorContext.ts';
import { mapping_add, mapping_mul, mapping_sufficient } from '../logic/mappingComparison.ts';
import { hori, verti } from '../logic/positioning.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import type { uint } from '../types/RestrictedTypes.ts';
import { InlineSpans } from './InlineSpans.tsx';
import { ResourceMapDisplay } from './ResourceMapDisplay.tsx';

const overlay_style = {
    position: 'absolute',
    top: '0',
} satisfies React.CSSProperties;

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
} satisfies React.CSSProperties;

export function FloorExtendOverlay() {
    const [floor, update_floor] = useContext(FloorContext);
    const [building] = useContext(BuildingContext);

    const below = building.floors[building.top_floor - floor.height + 1];
    const expand_left = (floor.height > 0 && below ? below.size_left : building.max_width) - floor.size_left;
    const expand_right = (floor.height > 0 && below ? below.size_right : building.max_width) - floor.size_right;

    let right = null;
    let left = null;

    const cost_build = floor.kind
        ? mapping_add(FLOOR_DEFS.buildables[floor.kind].cost_to_build, FLOOR_DEFS.empty.cost_to_build)
        : FLOOR_DEFS.empty.cost_to_build;

    if (expand_right > 0) {
        const cost = mapping_mul(cost_build, expand_right);
        const sufficient_funds = mapping_sufficient(building.wallet, cost);
        right = (
            <div
                style={{
                    ...overlay_style,
                    right: hori(-(floor.size_right + expand_right)),
                    height: verti(1),
                    width: hori(expand_right),
                    background: sufficient_funds
                        ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                        : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    if (sufficient_funds)
                        update_floor({
                            action: 'extend-floor',
                            size_right: expand_right as uint,
                        });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            ...popover_style,
                            right: hori(expand_right),
                        }}
                    >
                        {!sufficient_funds && <span style={{ color: 'red' }}>Insufficient Funds</span>}
                        Extend Right ({expand_right}m x (<ResourceMapDisplay resources={cost_build} />
                        )/m) =
                        <ResourceMapDisplay
                            style={{
                                fontSize: 'x-large',
                                color: sufficient_funds ? 'green' : 'red',
                            }}
                            resources={cost}
                        />
                    </span>
                </div>
            </div>
        );
    }
    if (expand_left > 0) {
        const cost = mapping_mul(cost_build, expand_left);
        const sufficient_funds = mapping_sufficient(building.wallet, cost);
        left = (
            <div
                style={{
                    ...overlay_style,
                    left: hori(-(expand_left + floor.size_left)),
                    height: verti(1),
                    width: hori(expand_left),
                    background: sufficient_funds
                        ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                        : 'color-mix(in srgb, red 30%, transparent)',
                }}
                className="hover-parent-display"
                onClick={() => {
                    if (sufficient_funds)
                        update_floor({
                            action: 'extend-floor',
                            size_left: expand_left as uint,
                        });
                }}
            >
                <div className="hover-child-display">
                    <span
                        style={{
                            ...popover_style,
                            left: hori(expand_left),
                        }}
                    >
                        <InlineSpans>
                            {!sufficient_funds && <span style={{ color: 'red' }}>Insufficient Funds</span>}
                            Extend Left ({expand_left}m x (<ResourceMapDisplay resources={cost_build} />
                            )/m) =
                            <ResourceMapDisplay
                                style={{
                                    fontSize: 'x-large',
                                    color: sufficient_funds ? 'green' : 'red',
                                }}
                                resources={cost}
                            />
                        </InlineSpans>
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

    const update = useCallback(() => {
        update_building({
            action: 'add-floor',
            position: 'top',
        });
    }, [update_building]);

    const size = FLOOR_DEFS.new_floor_size[0] + FLOOR_DEFS.new_floor_size[1];
    const cost = mapping_mul(FLOOR_DEFS.empty.cost_to_build, size);
    const sufficient_funds = mapping_sufficient(building.wallet, cost);

    const big_green: React.CSSProperties = {
        fontSize: 'x-large',
        color: sufficient_funds ? 'green' : 'red',
    };

    return (
        <div
            style={{
                ...overlay_style,
                height: verti(1),
                width: hori(size),
                background: sufficient_funds
                    ? 'color-mix(in srgb, lawngreen 30%, transparent)'
                    : 'color-mix(in srgb, red 30%, transparent)',
                left: hori(-FLOOR_DEFS.new_floor_size[0]),
            }}
            className="hover-parent-display"
            onClick={() => {
                if (!sufficient_funds) return;
                update();
            }}
        >
            <div className="hover-child-display">
                <span
                    style={{
                        ...popover_style,
                        top: verti(-1),
                    }}
                >
                    <InlineSpans>
                        {!sufficient_funds && <span style={{ color: 'red' }}>Insufficient Funds</span>}
                        New Floor ({size}m x (
                        <ResourceMapDisplay resources={FLOOR_DEFS.empty.cost_to_build} />
                        )/m) =
                        <ResourceMapDisplay resources={cost} style={big_green} />
                    </InlineSpans>
                </span>
            </div>
        </div>
    );
}
