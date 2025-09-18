import {useCallback, useContext} from 'react';
import {
    BuildingContext,
    ConstructionContext,
    FloorContext,
} from '../context/stateContext.ts';
import type {Floor} from '../types/Floor.ts';
import {FLOOR_HEIGHT, PIXELS_PER_UNIT, ROOM_HEIGHT} from '../constants.ts';
import {RoomComponent} from './RoomComponent.tsx';
import {FLOOR_DEFS} from '../types/FloorDefinition.ts';
import {BuildRoomOverlay} from "./BuildRoomOverlay.tsx";

interface Props {
    floor: Floor;
}

export function FloorComponent({floor}: Props) {
    const [building, updateBuilding] = useContext(BuildingContext);
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

    const [construction,] = useContext(ConstructionContext);
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;

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
                {floor.height > 1 ? roof_below(floor, building.floors[building.roof_height - floor.height + 1]) : null}
                {construction?.type === 'room' && floor_def.rooms.includes(construction.value) ? (
                    <BuildRoomOverlay room_kind={construction.value}/>
                ) : null}
                {floor.rooms.map((room) => (
                    <div
                        key={room.position}
                        style={{
                            left: `${(room.position + floor.size_left) * PIXELS_PER_UNIT}px`,
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
        width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
        height: `${ROOM_HEIGHT}px`,
        backgroundImage: `url(${floor_def.background})`,
        borderBottom: `2px solid black`,
    };
    return <div style={style} className={'position-child'}></div>;
}

function roof_below(floor: Floor, below: Floor | undefined) {
    // lots of similarities to TopRoofComponent
    if (!below)
        return null;
    const below_size = below.size_left + below.size_right;
    const self_size = floor.size_left + floor.size_right;
    if (below_size <= self_size)
        return null;
    return (
        <div
            className={'position-child'}
            id={`floor-${below.height}-roof`}
            style={{
                left: `-${(below.size_left - floor.size_left) * PIXELS_PER_UNIT}px`,
                backgroundRepeat: 'repeat-x',
                backgroundImage: `url(${FLOOR_DEFS.empty_roof.background})`,
                width: `${below_size * PIXELS_PER_UNIT}px`,
                height: `${ROOM_HEIGHT}px`,
                borderBottom: `2px solid black`,
                zIndex: -1,
            }}>
        </div>
    );
}


export function TopRoofComponent() {
    // lots of similarities to roof_below
    const [building] = useContext(BuildingContext);
    const floor = building.floors[0];
    return (
        <div
            className={'position-child'}
            id={`roof-${floor.height}`}
            style={{
                left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
                top: `-${(floor.height + 1) * FLOOR_HEIGHT}px`,
                backgroundRepeat: 'repeat-x',
                backgroundImage: `url(${FLOOR_DEFS.empty_roof.background})`,
                width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
                height: `${ROOM_HEIGHT}px`,
                borderBottom: `2px solid black`,
                zIndex: -1,
            }}
        >

        </div>
    )
}