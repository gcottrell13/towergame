import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { BuildingContext } from '../context/BuildingContext.ts';
import { useBuildingActions } from '../hooks/useBuildingActions.ts';
import type { Building } from '../types/Building.ts';
import { RoomBuilderTotalMemo } from './BuildRoomOverlay.tsx';
import { FloorComponentMemo, TopRoofComponent } from './FloorComponent.tsx';
import { TransportationComponentMemo } from './TransportationComponent.tsx';

const ground_style = {
    background: 'saddlebrown',
    width: '100vw',
} as const;

interface Props {
    building: Building;
}

export function BuildingComponent({ building }: Props) {
    const update = useBuildingActions(building);

    const ground_depth = FLOOR_HEIGHT * Math.max(4, building.floors.length - building.top_floor + 4);

    return (
        <BuildingContext value={[building, update]}>
            <div
                id={`building-${building.id}`}
                style={{
                    left: `${building.position * PIXELS_PER_UNIT}px`,
                    position: 'absolute',
                }}
            >
                {Object.values(building.floors).map((floor) => (
                    <FloorComponentMemo key={floor.height} floor={floor} />
                ))}
                <TopRoofComponent />
                <div
                    id={`ground-${building.id}`}
                    style={{
                        left: `-${building.position * PIXELS_PER_UNIT}px`,
                        height: `${ground_depth}px`,
                        position: 'absolute',
                        ...ground_style,
                    }}
                ></div>
                <RoomBuilderTotalMemo />
                {building.transports.map((t) => (
                    <TransportationComponentMemo key={`${t.height}-${t.position}`} transport={t} />
                ))}
            </div>
        </BuildingContext>
    );
}
