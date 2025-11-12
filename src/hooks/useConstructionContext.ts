import pick from 'lodash/pick';
import { create } from 'zustand/react';
import { useShallow } from 'zustand/react/shallow';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { RoomKind } from '../types/RoomDefinition.ts';
import type { TransportationKind } from '../types/TransportationDefinition.ts';

type STATE_TYPE = {
    room: { value: RoomKind };
    rezone: { value: FloorKind };
    // biome-ignore lint/complexity/noBannedTypes: it's just empty
    extend_floor: {};
    // biome-ignore lint/complexity/noBannedTypes: it's just empty
    destroy_room: {};
    transport: { value: TransportationKind };
};

// the conditional is a little trick to distribute this mapped type over all the items in a union
type map_distribute<T extends keyof STATE_TYPE> = T extends unknown ? { type: T } & STATE_TYPE[T] : never;

type Store = Partial<STATE_TYPE> & {
    current: keyof STATE_TYPE | null;
    update<T extends keyof STATE_TYPE>(s: map_distribute<T> | null): void;
};

const constructionStore = create<Store>((set, get) => ({
    current: null,
    update(s) {
        const current = get().current;
        if (current) set({ [current]: undefined });
        if (s) {
            const { type } = s;
            set({ [type]: s, current: type });
        }
    },
}));

/**
 * subscribe to just the construction contexts that you need
 * @param keys
 */
export function useConstructionContext<T extends keyof STATE_TYPE>(
    ...keys: T[]
): [map_distribute<T> | null, (s: map_distribute<T> | null) => void] {
    const { update, current, ...rest } = constructionStore(
        useShallow((state) => pick(state, 'update', 'current', ...keys)),
    );
    if (!update) return [null, () => {}];
    // @ts-expect-error
    return [current ? (rest[current] ?? null) : null, update];
}
