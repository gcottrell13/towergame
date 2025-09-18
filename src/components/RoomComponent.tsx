import type { Room } from '../types/Room.ts';
import {PIXELS_PER_UNIT, ROOM_HEIGHT} from '../constants.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import {useContext, memo} from "react";
import {FloorContext} from "../context/stateContext.ts";
import {useConstructionContext} from "../hooks/useConstructionContext.ts";

interface Props {
    room: Room;
}

export function RoomComponent({ room }: Props) {
    const room_def = ROOM_DEFS[room.kind];
    const [floor] = useContext(FloorContext);
    const [_construction,] = useConstructionContext("destroy_room");
    return (
        <div
            className="fit-content no-sel"
            id={`${room.kind}-${room.position}`}
            style={{
                left: `${(room.position + floor.size_left) * PIXELS_PER_UNIT}px`,
                top: '1px',
                backgroundRepeat: 'repeat',
                width: `${room.width * PIXELS_PER_UNIT}px`,
                height: `${room.height * ROOM_HEIGHT}px`,
                backgroundImage: `url(${room_def.sprite_empty})`,
                position: 'absolute',
            }}
        ></div>
    );
}

export const RoomComponentMemo = memo(RoomComponent);