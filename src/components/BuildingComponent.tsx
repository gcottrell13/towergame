import { useCallback, useContext } from 'react';
import { BuildingContext } from '../context/BuildingContext.ts';
import { PausedContext } from '../context/PausedContext.ts';
import { useBuildingActions } from '../hooks/useBuildingActions.ts';
import { useBuildingTick } from '../hooks/useBuildingTick.ts';
import { useScroll } from '../hooks/useScroll.ts';
import { hori, verti } from '../logicFunctions.ts';
import type { Building } from '../types/Building.ts';
import { BuildMenu } from './BuildMenu.tsx';
import { RoomBuilderTotalMemo } from './BuildRoomOverlay.tsx';
import { FloorComponentMemo, TopRoofComponent } from './FloorComponent.tsx';
import { TransportationComponentMemo } from './TransportationComponent.tsx';
import { TowerWorkerComponentMemo } from './TowerWorkerComponent.tsx';
import { DayTimerDisplay } from './DayTimerDisplay.tsx';

interface Props {
    building: Building;
    show_build_menu?: boolean;
}

export function BuildingComponent({ building, show_build_menu = true }: Props) {
    const update = useBuildingActions(building);
    const ref = useScroll();
    const paused = useContext(PausedContext);
    const can_tick = useCallback(() => building.day_started && !paused, [building, paused]);
    useBuildingTick(can_tick, update);

    const top = verti(Math.max(0, building.floors.length - 10));
    const left = `calc(100vw/2 + ${hori(building.position)})`;

    return (
        <BuildingContext value={[building, update]}>
            <Ground building={building} />
            <DayTimerDisplay />
            {show_build_menu && <BuildMenu />}
            <div
                ref={ref}
                id={`building-${building.id}`}
                style={{
                    left,
                    position: 'absolute',
                    height: verti(2),
                    top: `calc(100vh + ${top})`,
                    animationPlayState: paused ? 'paused' : 'running',
                }}
            >
                {Object.values(building.floors).map((floor) => (
                    <FloorComponentMemo key={floor.height} floor={floor} />
                ))}
                <TopRoofComponent />
                <RoomBuilderTotalMemo />
                {Object.entries(building.transports).map(([_id, t]) => (
                    <TransportationComponentMemo key={`${t.height}-${t.position}`} transport={t} />
                ))}
                {Object.values(building.workers).map((worker) => (
                    <TowerWorkerComponentMemo worker={worker} key={worker.id} />
                ))}
            </div>
        </BuildingContext>
    );
}

function Ground({ building }: { building: Building }) {
    const ground_depth = verti(Math.max(4, building.floors.length - building.top_floor + 4));
    const g_width = hori((building.position ?? 0) + building.max_width + 5);
    const top = verti(Math.max(0, building.floors.length - 10));
    return (
        <div
            id={`ground-${building.id}`}
            style={{
                top: `calc(100vh + ${top})`,
                height: ground_depth,
                position: 'absolute',
                width: `calc(100vw + ${g_width})`,
                background: 'saddlebrown',
            }}
        >
            <div
                style={{
                    // a fun little gradient over the ground to make the depths appear different
                    height: ground_depth,
                    backgroundSize: `${g_width} ${verti(100)}`,
                    backgroundImage:
                        'linear-gradient(to bottom, color-mix(in srgb, red, transparent 90%), color-mix(in srgb, yellow, transparent 90%))',
                }}
            />
        </div>
    );
}
