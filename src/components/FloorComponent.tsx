import {memo, useCallback, useContext} from 'react';
import {
    BuildingContext,
    FloorContext,
} from '../context/stateContext.ts';
import type {Floor} from '../types/Floor.ts';
import {FLOOR_HEIGHT, PIXELS_PER_UNIT, ROOM_HEIGHT} from '../constants.ts';
import {RoomComponentMemo} from './RoomComponent.tsx';
import {FLOOR_DEFS} from '../types/FloorDefinition.ts';
import {BuildRoomOverlay} from "./BuildRoomOverlay.tsx";
import {FloorRezoneOverlay} from "./FloorRezoneOverlay.tsx";
import {useConstructionContext} from "../hooks/useConstructionContext.ts";
import {FloorExtendOverlay, NewFloorOverlay} from "./FloorExtendOverlay.tsx";

interface Props {
    floor: Floor;
}

export function FloorComponent({floor}: Props) {
    const [, updateBuilding] = useContext(BuildingContext);
    const update = useCallback(
        (f: (b: Floor) => void) => {
            const new_b = {...floor};
            f(new_b);
            updateBuilding((b) => {
                b.floors[b.top_floor - floor.height] = new_b;
            });
        },
        [floor, updateBuilding],
    );

    const [construction,] = useConstructionContext("room", "rezone", "extend");
    const floor_def = floor.kind ? FLOOR_DEFS.buildables[floor.kind] : FLOOR_DEFS.empty;

    const style = {
        height: `${ROOM_HEIGHT}px`,
        top: `-${floor.height * FLOOR_HEIGHT}px`,
        left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
        position: 'absolute',
    } as const;

    return (
        <FloorContext.Provider value={[floor, update]}>
            <div
                style={style}
                id={`floor-${floor.height}`}
            >
                <Background floor={floor} />
                <Roof floor={floor} />
                {construction?.type === 'room' && floor_def.rooms.includes(construction.value) && (
                    <BuildRoomOverlay room_kind={construction.value}/>
                )}
                {construction?.type === 'rezone' && floor_def.id !== construction.value && (
                    <FloorRezoneOverlay floor_kind={construction.value} />
                )}
                {construction?.type === 'extend' && (
                    <FloorExtendOverlay />
                )}
                {floor.rooms.map((room) => (
                    <RoomComponentMemo key={room.position} room={room}/>
                ))}
            </div>
        </FloorContext.Provider>
    );
}

export const FloorComponentMemo = memo(FloorComponent);

function Background({floor}: {floor: Floor}) {
    const floor_def = floor.kind
        ? FLOOR_DEFS.buildables[floor.kind]
        : FLOOR_DEFS.empty;
    return <div style={{
        backgroundRepeat: 'repeat-x',
        width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
        height: `${ROOM_HEIGHT}px`,
        backgroundImage: `url(${floor_def.background})`,
        borderBottom: `2px solid black`,
        position: 'absolute',
    }}></div>;
}

function Roof({floor}: {floor: Floor}) {
    if (floor.height < 1)
        return null;
    const self_size = floor.size_left + floor.size_right;
    return (
        <div
            id={`floor-${floor.height}-roof`}
            style={{
                left: `0`,
                top: `-${FLOOR_HEIGHT}px`,
                backgroundRepeat: 'repeat-x',
                backgroundImage: `url(${FLOOR_DEFS.empty_roof.background})`,
                width: `${self_size * PIXELS_PER_UNIT}px`,
                height: `${ROOM_HEIGHT}px`,
                borderBottom: `2px solid black`,
                zIndex: -1,
                position: 'absolute',
            }}>
        </div>
    );
}


export function TopRoofComponent() {
    const [building,] = useContext(BuildingContext);
    const floor = building.floors[0];
    const [construction,] = useConstructionContext("extend");
    return (
        <div
            id={`roof-${building.id}`}
            style={{
                position: 'absolute',
                left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
                top: `-${(floor.height + 1) * FLOOR_HEIGHT}px`,
                width: `${(floor.size_left + floor.size_right) * PIXELS_PER_UNIT}px`,
                height: `${ROOM_HEIGHT}px`,
            }}
        >
            {construction?.type === 'extend' && (
                <NewFloorOverlay />
            )}
        </div>
    )
}