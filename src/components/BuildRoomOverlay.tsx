import { createContext, memo, useContext, useMemo, useState } from 'react';
import { clamp } from '../clamp.ts';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT, ROOM_HEIGHT, Z_INDEX } from '../constants.ts';
import { BuildingContext } from '../context/BuildingContext.ts';
import { FloorContext } from '../context/FloorContext.ts';
import { useConstructionContext } from '../hooks/useConstructionContext.ts';
import { useFloorActions } from '../hooks/useFloorActions.ts';
import { hori, verti } from '../logic/positioning.ts';
import type { Building } from '../types/Building.ts';
import type { Floor } from '../types/Floor.ts';
import { FLOOR_DEFS } from '../types/FloorDefinition.ts';
import type { int } from '../types/RestrictedTypes.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';
import { useRoomExtender } from './RoomExtender.tsx';

const ResizingRoomCtx = createContext<[boolean, (x: boolean) => void]>([false, () => {}]);

type T = 'room' | 'transport';
type V = ReturnType<typeof useConstructionContext<T>>;
type V2 = NonNullable<V[0]>;

export function RoomBuilderTotal() {
    const [building] = useContext(BuildingContext);
    const [construction] = useConstructionContext('room', 'transport');
    const [choosing_height, set_choosing_height] = useState(false);

    if (!construction) return null;

    const bottom_floor = building.floors[building.floors.length - 1];

    return (
        <div
            className={'room-builder-total'}
            style={{
                zIndex: Z_INDEX.builder_overlay,
                position: 'absolute',
                left: hori(-building.max_width),
                top: verti(-building.top_floor),
                width: hori(building.max_width * 2),
                height: verti(building.top_floor - bottom_floor.height),
            }}
        >
            <ResizingRoomCtx value={[choosing_height, set_choosing_height]}>
                {building.floors
                    .filter((floor) => {
                        if (construction.type === 'room') {
                            const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : null;
                            return floor_def?.rooms.includes(construction.value) ?? false;
                        } else if (construction.type === 'transport') {
                            return TRANSPORT_DEFS[construction.value].can_stop_at_floor?.call(null, floor) ?? true;
                        }
                        return false;
                    })
                    .map((x) => (
                        <RoomBuilderFloor key={x.height} floor={x} construction={construction} />
                    ))}
            </ResizingRoomCtx>
        </div>
    );
}

export const RoomBuilderTotalMemo = memo(RoomBuilderTotal);

function RoomBuilderFloor({ floor, construction }: { floor: Floor; construction: V2 }) {
    const [building] = useContext(BuildingContext);
    const update = useFloorActions(floor);
    return (
        <FloorContext value={[floor, update]}>
            <div
                style={{
                    position: 'absolute',
                    top: verti(building.top_floor - floor.height - 1),
                    left: hori(building.max_width - floor.size_left),
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
    const [building, update_building] = useContext(BuildingContext);
    const [floor, update_floor] = useContext(FloorContext);
    const def = construction.type === 'room' ? ROOM_DEFS[construction.value] : TRANSPORT_DEFS[construction.value];
    const [bp_location, set_bp_location] = useState<number | null>(null);
    const [choosing_height, set_choosing_height] = useContext(ResizingRoomCtx);
    const { width, height, extension_overlay } = useRoomExtender(def, update, () => {
        set_choosing_height(false);
        set_bp_location(null);
    });
    const [, set_construction] = useConstructionContext(construction.type);
    const collision_info = useMemo(() => create_collision_info(building, floor), [building, floor]);

    function update() {
        set_construction(construction);
        set_choosing_height(false);
        set_bp_location(null);
        if (def.d === 'room') {
            update_floor({
                action: 'buy-room',
                room: {
                    width,
                    height,
                    kind: def.id,
                    position: bp_location as int,
                    bottom_floor: floor.height,
                },
            });
        } else if (def.d === 'transport') {
            update_building({
                action: 'buy-transport',
                kind: def.id,
                position: bp_location as int,
                height,
                bottom_floor: floor.height,
            });
        }
    }

    return (
        <div
            style={{
                ...style,
                width: hori(floor.size_right + floor.size_left),
                background: choosing_height ? '' : 'color-mix(in srgb, lawngreen 30%, transparent)',
            }}
            onMouseMove={(ev) => {
                if (choosing_height) return;
                const loc = clamp(
                    Math.round(ev.nativeEvent.offsetX / PIXELS_PER_UNIT - floor.size_left - def.min_width / 2),
                    -floor.size_left,
                    floor.size_right - def.min_width,
                );
                // if colliding with other rooms, don't update position and just keep the last one
                for (const other_room of collision_info) {
                    if (loc + def.min_width > other_room.left && loc < other_room.right) return;
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

                if (def.min_height !== def.max_height || (def.d === 'room' && def.min_width !== def.max_width)) {
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
                        left: hori(bp_location + floor.size_left),
                        width: hori(width),
                        height: verti(height - 1, ROOM_HEIGHT),
                        top: verti(-height + 1),
                        position: 'absolute',
                        backgroundImage: `url(${def.sprite_empty})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: `${hori(def.min_width)} ${FLOOR_HEIGHT}px`,
                    }}
                />
            )}
            {choosing_height && bp_location && (
                <div
                    style={{
                        position: 'absolute',
                        left: hori(bp_location + floor.size_left),
                    }}
                >
                    {extension_overlay}
                </div>
            )}
        </div>
    );
}

function create_collision_info(building: Building, floor: Floor): { left: number; right: number }[] {
    const items = [];
    for (const f of building.floors.slice(building.top_floor - floor.height)) {
        for (const room_id of f.room_ids) {
            const room = building.rooms[room_id];
            if (room.bottom_floor <= f.height && room.height + room.bottom_floor > floor.height)
                items.push({
                    left: room.position,
                    right: room.position + room.width,
                });
        }
    }
    return items;
}
