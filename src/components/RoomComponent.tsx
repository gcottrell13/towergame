import { memo } from 'react';
import { Z_INDEX } from '../constants.ts';
import { useSelectedRoom } from '../hooks/useSelectedRoom.ts';
import { hori, verti } from '../logic/positioning.ts';
import type { Room } from '../types/Room.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';

interface Props {
    room: Room;
}

export function RoomComponent({ room }: Props) {
    const room_def = ROOM_DEFS[room.kind];
    const [selected_room, set_selected_room] = useSelectedRoom(room.id);
    // const [_floor] = useContext(FloorContext);
    // const [_construction] = useConstructionContext('destroy_room');
    return (
        <div
            className="fit-content"
            id={`${room.kind}-${room.position}`}
            onClick={() => {
                set_selected_room(selected_room === room.id ? null : room.id);
            }}
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
        >
            {selected_room === room.id && (
                <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 100, 0, .50)'}} />
            )}
        </div>
    );
}

export const RoomComponentMemo = memo(RoomComponent);
