import { useCallback, useEffect, useState } from 'react';
import type { RoomKind } from '../types/RoomDefinition.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';

type C<T> = [T, (s: T) => void];

type STATE_TYPE = {
    room: { value: RoomKind };
    rezone: { value: FloorKind };
    extend: {};
    destroy_room: {};
};

const subscribers: {
    [p in keyof STATE_TYPE]: React.Dispatch<
        React.SetStateAction<map_distribute<p> | null>
    >[];
} = {
    room: [],
    rezone: [],
    destroy_room: [],
    extend: [],
};
let current_state_name: keyof STATE_TYPE | null = null;
let current_state: any = null;

// the conditional is a little trick to distribute this mapped type over all the items in a union
type map_distribute<T extends keyof STATE_TYPE> = T extends any
    ? { type: T } & STATE_TYPE[T]
    : never;

/**
 * subscribe to just the construction contexts that you need
 * @param keys
 */
export function useConstructionContext<T extends keyof STATE_TYPE>(
    ...keys: T[]
): C<map_distribute<T> | null> {
    const [state, set_state] = useState<map_distribute<T> | null>(
        current_state,
    );
    useEffect(() => {
        for (const key of keys) subscribers[key].push(set_state);
        return () => {
            for (const key of keys) {
                const i = subscribers[key].indexOf(set_state);
                if (i >= 0) {
                    subscribers[key].splice(i, 1);
                }
            }
        };
    }, [keys]);
    const set = useCallback((v: map_distribute<T> | null) => {
        const key = v?.type ?? null;
        if (current_state_name !== null && current_state_name !== key) {
            for (const sub of subscribers[current_state_name]) {
                sub(null);
            }
        }
        current_state_name = key;
        current_state = v;
        if (key !== null) {
            for (const sub of subscribers[key]) {
                sub(v as any);
            }
        }
    }, []);
    return [state, set];
}
