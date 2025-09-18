import { useCallback, useContext } from 'react';
import { BuildingContext, SaveFileContext } from '../context/stateContext.ts';
import type { Building } from '../types/Building.ts';
import {FLOOR_HEIGHT, PIXELS_PER_UNIT} from '../constants.ts';
import {FloorComponent, TopRoofComponent} from './FloorComponent.tsx';

const ground_style = {
    background: 'saddlebrown',
    width: '100vw',
} as const;

interface Props {
    building: Building;
}

export function BuildingComponent({ building }: Props) {
    const [_saveFile, updateSaveFile] = useContext(SaveFileContext);
    const update = useCallback(
        (f: (b: Building) => void) => {
            const new_b = { ...building };
            f(new_b);
            updateSaveFile((save) => {
                save.buildings[building.id] = new_b;
            });
        },
        [building, updateSaveFile],
    );

    const ground_depth =
        FLOOR_HEIGHT * Math.max(4, building.floors.length - building.roof_height + 4);

    return (
        <BuildingContext value={[building, update]}>
            <div
                id={`building-${building.id}`}
                className={'position-parent'}
            >
                {Object.values(building.floors).map((floor) => (
                    <div
                        id={`floor-${floor.height}-container`}
                        key={floor.height}
                        className={'position-child'}
                        style={{
                            top: `-${floor.height * FLOOR_HEIGHT}px`,
                            left: `-${floor.size_left * PIXELS_PER_UNIT}px`,
                        }}
                    >
                        <FloorComponent floor={floor} />
                    </div>
                ))}
                <TopRoofComponent />
            </div>
            <div
                className={'position-child'}
                id={`ground-${building.id}`}
                style={{
                    left: `-${building.position * PIXELS_PER_UNIT}px`,
                    height: `${ground_depth}px`,
                    ...ground_style,
                }}
            ></div>
        </BuildingContext>
    );
}
