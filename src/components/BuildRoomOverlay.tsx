import { createContext, memo, useContext, useState } from 'react';
import {
    BuildingContext,
    FloorContext,
    SaveFileContext,
} from '../context/stateContext.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import {
    FLOOR_HEIGHT,
    PIXELS_PER_UNIT,
    ROOM_HEIGHT,
    Z_INDEX,
} from '../constants.ts';
import type { int } from '../types/RestrictedTypes.ts';
import { RoomState } from '../types/Room.ts';
import { clamp } from '../clamp.ts';
import { useRoomExtender } from './RoomExtender.tsx';
import { useConstructionContext } from '../hooks/useConstructionContext.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import type { Floor } from '../types/Floor.ts';
import { useFloorProvider } from '../hooks/useFloorProvider.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';

const ResizingRoomCtx = createContext<[boolean, (x: boolean) => void]>([
    false,
    (_x: boolean) => {},
]);

// number of floors
const extra_height = 10;

type T = 'room' | 'transport';
type V = ReturnType<typeof useConstructionContext<T>>;
type V2 = NonNullable<V[0]>;

export function RoomBuilderTotal() {
    const [building] = useContext(BuildingContext);
    const [construction, set_construction] = useConstructionContext(
        'room',
        'transport',
    );
    const [choosing_height, set_choosing_height] = useState(false);

    if (!construction) return null;

    const bottom_floor = building.floors[building.floors.length - 1];

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        <div
            onContextMenu={(ev) => {
                ev.preventDefault();
                set_construction(null);
                set_choosing_height(false);
            }}
            className={'room-builder-total'}
            style={{
                zIndex: Z_INDEX.builder_overlay,
                position: 'absolute',
                left: `-${building.max_width * PIXELS_PER_UNIT}px`,
                top: `${-(building.top_floor + extra_height) * FLOOR_HEIGHT}px`,
                width: `${building.max_width * 2 * PIXELS_PER_UNIT}px`,
                height: `${(building.top_floor - bottom_floor.height + extra_height) * FLOOR_HEIGHT}px`,
            }}
        >
            <ResizingRoomCtx value={[choosing_height, set_choosing_height]}>
                {building.floors
                    .filter((floor) => {
                        if (construction.type === 'room') {
                            const floor_def = floor.kind
                                ? FLOOR_DEFS.buildables[floor.kind]
                                : null;
                            return (
                                floor_def?.rooms.includes(construction.value) ??
                                false
                            );
                        } else if (construction.type === 'transport') {
                            return (
                                TRANSPORT_DEFS[
                                    construction.value
                                ].can_stop_at_floor?.call(null, floor) ?? true
                            );
                        }
                        return false;
                    })
                    .map((x) => (
                        <RoomBuilderFloor
                            key={x.height}
                            floor={x}
                            construction={construction}
                        />
                    ))}
            </ResizingRoomCtx>
        </div>
    );
}

export const RoomBuilderTotalMemo = memo(RoomBuilderTotal);

function RoomBuilderFloor({
    floor,
    construction,
}: {
    floor: Floor;
    construction: V2;
}) {
    const [building] = useContext(BuildingContext);
    const floor_update = useFloorProvider(floor);
    return (
        <FloorContext value={[floor, floor_update]}>
            <div
                style={{
                    position: 'absolute',
                    top: `${-(floor.height - 1 - extra_height) * FLOOR_HEIGHT}px`,
                    left: `${(building.max_width - floor.size_left) * PIXELS_PER_UNIT}px`,
                }}
            >
                <BuildRoomOverlay construction={construction} />
            </div>
        </FloorContext>
    );
}

interface BuildRoomOverlayProps {
    construction: V2;
}

const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    height: `${FLOOR_HEIGHT}px`,
    zIndex: Z_INDEX.builder_overlay + 1,
} as const;

function BuildRoomOverlay({ construction }: BuildRoomOverlayProps) {
    const [, update_save] = useContext(SaveFileContext);
    const [, update_building] = useContext(BuildingContext);
    const [floor, update_floor] = useContext(FloorContext);
    const def =
        construction.type === 'room'
            ? ROOM_DEFS[construction.value]
            : TRANSPORT_DEFS[construction.value];
    const [bp_location, set_bp_location] = useState<number | null>(null);
    const [choosing_height, set_choosing_height] = useContext(ResizingRoomCtx);
    const { width, height, extension_overlay } = useRoomExtender(
        def,
        update,
        () => {
            set_choosing_height(false);
            set_bp_location(null);
        },
    );
    const [, set_construction] = useConstructionContext(construction.type);

    function update() {
        set_construction(construction);
        set_choosing_height(false);
        set_bp_location(null);
        update_save((s) => {
            let cost = 0;
            if (def.d === 'room') {
                cost = def.cost_to_build(width, height);
            } else if (def.d === 'transport') {
                cost = def.cost_per_floor(height);
            }
            s.money = (s.money - cost) as int;
        });
        if (def.d === 'room') {
            update_floor((f) => {
                f.rooms = f.rooms.toSpliced(0, 0, {
                    width,
                    height,
                    kind: def.id,
                    position: bp_location as int,
                    state: RoomState.Unknown,
                    bottom_floor: floor.height,
                });
            });
        } else if (def.d === 'transport') {
            update_building((b) => {
                b.transports.push({ kind: def.id });
            });
        }
    }

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: mouseMove
        // biome-ignore lint/a11y/useKeyWithClickEvents: no keys
        <div
            className={'no-sel'}
            style={{
                ...style,
                width: `${(floor.size_right + floor.size_left) * PIXELS_PER_UNIT}px`,
                background: choosing_height
                    ? ''
                    : 'color-mix(in srgb, lawngreen 30%, transparent)',
            }}
            onMouseMove={(ev) => {
                if (choosing_height) return;
                const loc = clamp(
                    Math.floor(
                        ev.nativeEvent.offsetX / PIXELS_PER_UNIT -
                            floor.size_left,
                    ),
                    -floor.size_left,
                    floor.size_right - def.min_width,
                );
                // if colliding with other rooms, don't update position and just keep the last one
                for (const other_room of floor.rooms) {
                    if (
                        loc + def.min_width > other_room.position &&
                        loc < other_room.position + other_room.width
                    )
                        return;
                }
                // note: check lower floors for tall rooms
                set_bp_location(loc);
            }}
            onMouseLeave={() => {
                if (choosing_height) return;
                set_bp_location(null);
            }}
            onClick={() => {
                if (bp_location === null) return;
                if (choosing_height) return;
                // note: if min height/width != max height/width,
                // then we need to go to phase 2 to select the size of the room
                // before we save the floor to the state

                if (
                    def.min_height !== def.max_height ||
                    (def.d === 'room' && def.min_width !== def.max_width)
                ) {
                    set_choosing_height(true);
                } else {
                    update();
                }
            }}
        >
            {bp_location !== null && (
                <div
                    className={'no-pointer'}
                    style={{
                        opacity: '50%',
                        left: `${(bp_location + floor.size_left) * PIXELS_PER_UNIT}px`,
                        width: `${width * PIXELS_PER_UNIT}px`,
                        height: `${(height - 1) * FLOOR_HEIGHT + ROOM_HEIGHT}px`,
                        top: `-${(height - 1) * FLOOR_HEIGHT}px`,
                        position: 'absolute',
                        backgroundImage: `url(${def.sprite_empty})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: `${def.min_width * PIXELS_PER_UNIT}px ${FLOOR_HEIGHT}px`,
                    }}
                />
            )}
            {choosing_height && bp_location && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${(bp_location + floor.size_left) * PIXELS_PER_UNIT}px`,
                    }}
                >
                    {extension_overlay}
                </div>
            )}
        </div>
    );
}
