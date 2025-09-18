import {useCallback, useContext} from 'react';
import {BuildingContext, SaveFileContext} from '../context/stateContext.ts';
import type {Building} from '../types/Building.ts';
import {FLOOR_HEIGHT, PIXELS_PER_UNIT} from '../constants.ts';
import {FloorComponentMemo, TopRoofComponent} from './FloorComponent.tsx';

const ground_style = {
    background: 'saddlebrown',
    width: '100vw',
} as const;

interface Props {
    building: Building;
}

export function BuildingComponent({building}: Props) {
    const [_saveFile, updateSaveFile] = useContext(SaveFileContext);
    const update = useCallback(
        (f: (b: Building) => void) => {
            const new_b = {...building};
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
                style={{
                    left: `${building.position * PIXELS_PER_UNIT}px`,
                    position: 'absolute',
                }}
            >
                {Object.values(building.floors).map((floor) => (
                    <FloorComponentMemo key={floor.height} floor={floor}/>
                ))}
                <TopRoofComponent/>
                <div
                    id={`ground-${building.id}`}
                    style={{
                        left: `-${building.position * PIXELS_PER_UNIT}px`,
                        height: `${ground_depth}px`,
                        position: 'absolute',
                        ...ground_style,
                    }}
                ></div>
            </div>
        </BuildingContext>
    );
}
