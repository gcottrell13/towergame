import { useCallback, useContext } from 'react';
import { BuildingContext } from '../context/BuildingContext.ts';
import type { FloorActions } from '../events/SaveFileActions.ts';
import type { Floor } from '../types/Floor.ts';

/**
 * provides a shorthand version of using actions that require a building id and floor id
 * @param floor
 */
export function useFloorActions(floor: Floor) {
    const [, update] = useContext(BuildingContext);
    return useCallback(
        (action: FloorActions, delay_ms: number = 0) => {
            update(
                {
                    ...action,
                    floor_id: floor.height,
                },
                delay_ms,
            );
        },
        [update, floor],
    );
}
