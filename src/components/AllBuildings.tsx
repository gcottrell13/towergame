import { useContext } from 'react';
import { FLOOR_HEIGHT } from '../constants.ts';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import { BuildingComponent } from './BuildingComponent.tsx';

export function AllBuildings() {
    const [state, _setState] = useContext(SaveFileContext);
    const max = Math.max(...state.buildings.map((x) => x.floors.length));
    const top = Math.max(0, max - 10) * FLOOR_HEIGHT;
    return (
        <div
            id={'game'}
            style={{
                top: `calc(100vh + ${top}px)`,
                position: 'absolute',
            }}
        >
            {state.buildings.map((building) => (
                <BuildingComponent key={building.id} building={building} />
            ))}
        </div>
    );
}
