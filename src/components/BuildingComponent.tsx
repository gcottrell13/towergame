import { BuildingContext } from '../context/BuildingContext.ts';
import { useBuildingActions } from '../hooks/useBuildingActions.ts';
import { useScroll } from '../hooks/useScroll.ts';
import { hori, verti } from '../logicFunctions.ts';
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
    const ref = useScroll();

    const ground_depth = verti(Math.max(4, building.floors.length - building.top_floor + 4));
    const top = verti(Math.max(0, building.floors.length - 10));

    const g_width = hori((building.position ?? 0) + building.max_width + 5);
    const left = `calc(100vw/2 + ${hori(building.position)})`;

    return (
        <BuildingContext value={[building, update]}>
            {show_build_menu && <BuildMenu />}
            <div
                ref={ref}
                id={`building-${building.id}`}
                style={{
                    left,
                    position: 'absolute',
                    height: verti(2),
                    top: `calc(100vh + ${top})`,
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
                    top: `calc(100vh + ${top})`,
                    height: ground_depth,
                    position: 'absolute',
                    width: `calc(100vw + ${g_width})`,
                    background: 'saddlebrown',
                }}
            />
        </BuildingContext>
    );
}
