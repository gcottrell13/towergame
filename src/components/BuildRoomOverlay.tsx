import { useContext, useState } from 'react';
import { FloorContext, SaveFileContext } from '../context/stateContext.ts';
import { ROOM_DEFS, type RoomKind } from '../types/RoomDefinition.ts';
import { PIXELS_PER_UNIT } from '../constants.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import { RoomState } from '../types/Room.ts';

interface Props {
    room_kind: RoomKind;
}

const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    background: 'color-mix(in srgb, lawngreen 30%, transparent)',
    zIndex: 10000,
} as const;

export function BuildRoomOverlay({ room_kind }: Props) {
    const [, update_save] = useContext(SaveFileContext);
    const [floor, update_floor] = useContext(FloorContext);
    const room_def = ROOM_DEFS[room_kind];
    const [bp_location, set_bp_location] = useState<number | null>(null);

    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: mouseMove
        // biome-ignore lint/a11y/useKeyWithClickEvents: no keys
        <div
            className={'no-sel'}
            style={{
                ...style,
                width: `${(floor.size_right + floor.size_left) * PIXELS_PER_UNIT}px`,
                left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
            }}
            onMouseMove={(ev) => {
                let loc = Math.floor(
                    ev.nativeEvent.offsetX / PIXELS_PER_UNIT - floor.size_left,
                );
                loc = Math.min(
                    // clamp between valid values
                    Math.max(loc, -floor.size_left),
                    floor.size_right - room_def.min_width,
                );
                // if colliding with other rooms, don't update position and just keep the last one
                for (const other_room of floor.rooms) {
                    if (
                        loc + room_def.min_width > other_room.position &&
                        loc < other_room.position + other_room.width
                    )
                        return;
                }
                // note: check lower floors for tall rooms
                set_bp_location(loc);
            }}
            onMouseLeave={() => {
                set_bp_location(null);
            }}
            onClick={() => {
                if (bp_location === null) return;
                // note: if min height/width != max height/width,
                // then we need to go to phase 2 to select the size of the room
                // before we save the floor to the state

                update_save((s) => {
                    s.money = (s.money - room_def.cost_to_build) as int;
                });
                update_floor((f) => {
                    f.rooms = f.rooms.toSpliced(0, 0, {
                        width: room_def.min_width,
                        kind: room_def.id,
                        position: bp_location as int,
                        state: RoomState.Unknown,
                        bottom_floor: floor.height,
                        height: 1 as uint,
                    });
                });
            }}
        >
            {bp_location !== null && (
                <img
                    className={'no-pointer'}
                    style={{
                        opacity: '50%',
                        left: `${(bp_location + floor.size_left) * PIXELS_PER_UNIT}px`,
                        position: 'absolute',
                    }}
                    src={room_def.sprite_empty}
                    alt={room_def.sprite_empty}
                />
            )}
        </div>
    );
}
