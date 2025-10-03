import type { Room } from '../types/Room.ts';
import {FLOOR_HEIGHT, PIXELS_PER_UNIT, Z_INDEX} from '../constants.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import { memo } from 'react';

interface Props {
    room: Room;
}

export function RoomComponent({ room }: Props) {
    const room_def = ROOM_DEFS[room.kind];
    // const [_floor] = useContext(FloorContext);
    // const [_construction] = useConstructionContext('destroy_room');
    return (
        <div
            className="fit-content no-sel"
            id={`${room.kind}-${room.position}`}
            style={{
                left: `${room.position * PIXELS_PER_UNIT}px`,
                top: `${-(room.height - 1) * FLOOR_HEIGHT}px`,
                backgroundRepeat: 'repeat',
                width: `${room.width * PIXELS_PER_UNIT}px`,
                height: `${room.height * FLOOR_HEIGHT}px`,
                backgroundImage: `url(${room_def.sprite_empty})`,
                position: 'absolute',
                backgroundSize: `${room_def.min_width * PIXELS_PER_UNIT}px ${FLOOR_HEIGHT}px`,
                zIndex: Z_INDEX.rooms,
            }}
        ></div>
    );
}

export const RoomComponentMemo = memo(RoomComponent);
