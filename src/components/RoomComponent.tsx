import isEmpty from 'lodash/isEmpty';
import { memo, useEffect, useState } from 'react';
import { Z_INDEX } from '../constants.ts';
import { useSelectedRoom } from '../hooks/useSelectedRoom.ts';
import { mapping_subtract } from '../logic/mappingComparison.ts';
import { hori, verti } from '../logic/positioning.ts';
import type { ResourceMap } from '../types/ResourceDefinition.ts';
import type { uint } from '../types/RestrictedTypes.ts';
import type { Room } from '../types/Room.ts';
import { ROOM_DEFS } from '../types/RoomDefinition.ts';
import { ResourceMapDisplay } from './ResourceMapDisplay.tsx';

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
                <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 100, 0, .50)' }} />
            )}
            {useResourcePopup(room)}
        </div>
    );
}

export const RoomComponentMemo = memo(RoomComponent);

function useResourcePopup(room: Room) {
    const [old_produce, set_old_produce] = useState(() => room.total_resources_produced);
    const [produce_display, set_produce_display] = useState<ResourceMap<uint> | null>(null);
    useEffect(() => {
        if (!ROOM_DEFS[room.kind].produce_to_wallet) return;
        const diff = mapping_subtract(room.total_resources_produced, old_produce, false);
        if (isEmpty(diff)) return;
        set_produce_display(diff);
        setTimeout(() => {
            set_produce_display(null);
        }, 1000);
        set_old_produce(room.total_resources_produced);
    }, [old_produce, room.total_resources_produced, room.kind]);
    return produce_display ? <Popup display={produce_display} /> : null;
}

function Popup({ display }: { display: ResourceMap<uint> }) {
    return (
        <span
            style={{ position: 'absolute', display: 'flex', gap: '5px', animation: 'slideUp 0.5s ease-out forwards' }}
        >
            <ResourceMapDisplay resources={display} />
        </span>
    );
}
