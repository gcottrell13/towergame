import {useContext} from "react";
import {SaveFileContext} from "../context/stateContext.ts";
import {BuildingComponent} from "./BuildingComponent.tsx";
import {FLOOR_HEIGHT, PIXELS_PER_UNIT} from "../constants.ts";

export function AllBuildings() {
    const [state, _setState] = useContext(SaveFileContext);
    return (
        <>
            {state.buildings.map(building => {
                const top = Math.max(0, building.floors.length - 10) * FLOOR_HEIGHT;
                return (
                    <div
                        className='position-child'
                        key={building.id}
                        id={`building-${building.id}-container`}
                        style={{
                            top: `calc(100vh + ${top}px)`,
                            left: `${building.position * PIXELS_PER_UNIT}px`,
                        }}>
                        <BuildingComponent building={building}/>
                    </div>
                );
            })}
        </>
    )
}