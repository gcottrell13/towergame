import {useCallback, useContext} from 'react';
import {
    BuildingContext,
    BuildingRoomContext,
    FloorContext,
    FloorRezoneContext,
} from '../context/stateContext.ts';
import type {Floor} from '../types/Floor.ts';
import {PIXELS_PER_UNIT, ROOM_HEIGHT} from '../constants.ts';
import {RoomComponent} from './RoomComponent.tsx';
import {FLOOR_DEFS} from '../types/FloorDefinition.ts';
import images from "../content/images.ts";

interface Props {
    floor: Floor;
}

export function FloorComponent({floor}: Props) {
    const [_building, updateBuilding] = useContext(BuildingContext);
    const update = useCallback(
        (f: (b: Floor) => void) => {
            const new_b = {...floor};
            f(new_b);
            updateBuilding((b) => {
                b.floors[b.roof_height - floor.height] = new_b;
            });
        },
        [floor, updateBuilding],
    );

    const [buildRoom] = useContext(BuildingRoomContext);
    const [floorRezone] = useContext(FloorRezoneContext);

    const style = {
        height: `${ROOM_HEIGHT}px`,
    } as const;

    return (
        <FloorContext.Provider value={[floor, update]}>
            <div
                style={style}
                id={`floor-${floor.height}`}
                className={'position-parent'}
            >
                {floor_bg(floor)}
                {floor.rooms.map((room) => (
                    <div
                        key={room.position}
                        style={{
                            left: `${room.position * PIXELS_PER_UNIT}px`,
                            top: '1px',
                        }}
                        className={'position-child'}
                    >
                        <RoomComponent room={room}/>
                    </div>
                ))}
            </div>
        </FloorContext.Provider>
    );
}

function floor_bg(floor: Floor) {
    const floor_def = floor.kind
        ? FLOOR_DEFS.buildables[floor.kind]
        : FLOOR_DEFS.empty;
    const style = {
        backgroundRepeat: 'repeat-x',
        left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
        width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
        height: `${ROOM_HEIGHT}px`,
        backgroundImage: `url(${images[floor_def.background]})`,
        borderBottom: `2px solid black`,
    };
    return <div style={style} className={'position-child'}></div>;
}
