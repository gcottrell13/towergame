import type { Room } from '../types/Room.ts';
import {PIXELS_PER_UNIT, ROOM_HEIGHT} from '../constants.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import images from "../content/images.ts";

interface Props {
    room: Room;
}

export function RoomComponent({ room }: Props) {
    const room_def = ROOM_DEFS[room.kind];
    return (
        <div
            className="fit-content no-sel"
            style={{
                backgroundRepeat: 'repeat',
                width: `${room.width * PIXELS_PER_UNIT}px`,
                height: `${room.height * ROOM_HEIGHT}px`,
                backgroundImage: `url(${images[room_def.sprite_empty]})`,
            }}
        ></div>
    );
}
