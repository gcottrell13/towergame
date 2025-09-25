import { useCallback, useContext } from 'react';
import { BuildingContext } from '../context/stateContext.ts';
import type { Floor } from '../types/Floor.ts';

export function useFloorProvider(floor: Floor) {
    const [, updateBuilding] = useContext(BuildingContext);
    const update = useCallback(
        (f: (b: Floor) => void) => {
            const new_b = { ...floor };
            f(new_b);
            updateBuilding((b) => {
                b.floors[b.top_floor - floor.height] = new_b;
            });
        },
        [floor, updateBuilding],
    );
    return update;
}
