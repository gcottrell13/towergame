import { useEffect, useRef } from 'react';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { BuildingContext } from '../context/BuildingContext.ts';
import { useBuildingActions } from '../hooks/useBuildingActions.ts';
import type { Building } from '../types/Building.ts';
import { BuildMenu } from './BuildMenu.tsx';
import { RoomBuilderTotalMemo } from './BuildRoomOverlay.tsx';
import { FloorComponentMemo, TopRoofComponent } from './FloorComponent.tsx';
import { TransportationComponentMemo } from './TransportationComponent.tsx';

interface Props {
    building: Building;
    show_build_menu?: boolean;
}

export function BuildingComponent({ building, show_build_menu = true }: Props) {
    const update = useBuildingActions(building);

    const ground_depth = FLOOR_HEIGHT * Math.max(4, building.floors.length - building.top_floor + 4);
    const top = Math.max(0, building.floors.length - 10) * FLOOR_HEIGHT;

    const leftpx = (building.position ?? 0) * PIXELS_PER_UNIT;
    const g_width = ((building.position ?? 0) + building.max_width + 5) * PIXELS_PER_UNIT;
    const left = `calc(100vw/2 + ${leftpx}px)`;

    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        setTimeout(
            () =>
                scrollRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                }),
            500,
        );
    }, []);

    return (
        <BuildingContext value={[building, update]}>
            {show_build_menu && <BuildMenu />}
            <div
                ref={scrollRef}
                id={`building-${building.id}`}
                style={{
                    left,
                    position: 'absolute',
                    height: `${FLOOR_HEIGHT * 2}px`,
                    top: `calc(100vh + ${top}px)`,
                }}
            >
                {Object.values(building.floors).map((floor) => (
                    <FloorComponentMemo key={floor.height} floor={floor} />
                ))}
                <TopRoofComponent />
                <RoomBuilderTotalMemo />
                {building.transports.map((t) => (
                    <TransportationComponentMemo key={`${t.height}-${t.position}`} transport={t} />
                ))}
            </div>
            <div
                id={`ground-${building.id}`}
                style={{
                    top: `calc(100vh + ${top}px)`,
                    height: `${ground_depth}px`,
                    position: 'absolute',
                    width: `calc(100vw + ${g_width}px)`,
                    background: 'saddlebrown',
                }}
            />
        </BuildingContext>
    );
}
