import { useCallback, useContext } from 'react';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import type { BuildingActions } from '../events/SaveFileActions.ts';
import type { Building } from '../types/Building.ts';

/**
 * provides a shorthand version of using actions that require a building id
 * @param building
 */
export function useBuildingActions(building: Building) {
    const [, update] = useContext(SaveFileContext);
    return useCallback(
        (action: BuildingActions, delay_ms: number = 0) => {
            update(
                {
                    ...action,
                    building_id: building.id,
                },
                delay_ms,
            );
        },
        [update, building.id],
    );
}
