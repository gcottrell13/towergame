import { useContext } from 'react';
import { SaveFileContext } from '../context/SaveFileContext.ts';
import { BuildingComponent } from './BuildingComponent.tsx';

export function AllBuildings() {
    const [state, _setState] = useContext(SaveFileContext);
    return (
        <div id={'game'}>
            {state.buildings.map((building) => (
                <BuildingComponent key={building.id} building={building} />
            ))}
        </div>
    );
}
