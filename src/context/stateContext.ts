import {createContext} from 'react';
import type {SaveFile} from "../types/SaveFile.ts";
import type {int, uint} from "../types/RestrictedTypes.ts";
import type {Building} from "../types/Building.ts";
import type {Floor} from "../types/Floor.ts";
import type {Room} from "../types/Room.ts";

type StateItem<T> = [T, (f: (s: T) => void) => void];

export const SaveFileContext = createContext<StateItem<SaveFile>>([
    {
        buildings: [],
        money: 0 as int,
        new_things_acked: {},
        rating: 0 as uint,
    },
    () => {
    },
]);

export const BuildingContext = createContext<StateItem<Building>>([{} as any, () => {
}]);
export const FloorContext = createContext<StateItem<Floor>>([{} as any, () => {
}]);
export const RoomContext = createContext<StateItem<Room>>([{} as any, () => {
}]);
