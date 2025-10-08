import { memo } from 'react';
import { Z_INDEX } from '../constants.ts';
import { hori, verti } from '../logicFunctions.ts';
import type { Room } from '../types/Room.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';

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
                left: hori(room.position),
                top: verti(-room.height + 1),
                backgroundRepeat: 'repeat',
                width: hori(room.width),
                height: verti(room.height),
                backgroundImage: `url(${room_def.sprite_empty})`,
                position: 'absolute',
                backgroundSize: `${hori(room_def.min_width)} ${verti(1)}`,
                zIndex: Z_INDEX.rooms,
            }}
        ></div>
    );
}

export const RoomComponentMemo = memo(RoomComponent);
