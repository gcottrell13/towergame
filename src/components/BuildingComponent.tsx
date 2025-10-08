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
            {show_build_menu && <BuildMenu />}
            <TimerDisplay />
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

const NOON = 12 * 60 * 1000;
function TimerDisplay() {
    const [building, update] = useContext(BuildingContext);
    const day_number = Math.floor(building.time_ms / building.time_per_day_ms) + 1;
    const sday_start = NOON - Math.floor((building.time_per_day_ms * 2) / 3);
    const day_start = Math.round(sday_start / 60_000) * 60_000;
    const time = building.time_ms % building.time_per_day_ms;
    return (
        <div
            style={{
                position: 'fixed',
                display: 'flex',
                justifyContent: 'center',
                width: 'calc(100vw)',
                padding: '4px',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px',
                }}
            >
                {building.day_started && (
                    <>
                        <span>Day {day_number}</span>
                        <Time time={time + day_start} />
                        <span style={{ display: 'flex', gap: '4px' }}>
                            <Time time={day_start} style={{ fontSize: 'small' }} />
                            <progress max={building.time_per_day_ms} value={time} />
                            <Time time={day_start + building.time_per_day_ms} style={{ fontSize: 'small' }} />
                        </span>
                    </>
                )}
                {!building.day_started && (
                    <button
                        type={'button'}
                        onClick={() =>
                            update({
                                action: 'start-day',
                            })
                        }
                    >
                        Start Day {day_number}
                    </button>
                )}
            </div>
        </div>
    );
}

function Time({ time, style }: { time: number; style?: React.CSSProperties }) {
    const mod12 = (time / 60 / 1000) % 12;
    const minute = (time / 1000) % 60;
    return (
        <span style={style}>
            {Math.floor(mod12) || 12}:{String(Math.floor(minute)).padStart(2, '0')} {time > NOON ? 'pm' : 'am'}
        </span>
    );
}
