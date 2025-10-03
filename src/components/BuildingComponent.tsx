import type { Building } from '../types/Building.ts';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { FloorComponentMemo, TopRoofComponent } from './FloorComponent.tsx';
import { RoomBuilderTotalMemo } from './BuildRoomOverlay.tsx';
import { TransportationComponentMemo } from './TransportationComponent.tsx';
import { BuildingContext } from '../context/BuildingContext.ts';

const ground_style = {
    background: 'saddlebrown',
    width: '100vw',
} as const;

interface Props {
    building: Building;
}

export function BuildingComponent({ building }: Props) {
    const ground_depth =
        FLOOR_HEIGHT *
        Math.max(4, building.floors.length - building.top_floor + 4);

    return (
        <BuildingContext value={building}>
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
                    <TransportationComponentMemo
                        key={`${t.height}-${t.position}`}
                        transport={t}
                    />
                ))}
            </div>
        </BuildingContext>
    );
}
