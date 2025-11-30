import { useCallback, useEffect, useMemo, useState } from 'react';

type Listener<T> = (s: T | null) => void;
type ListenerState<K extends symbol | number | string, T = K> = { [p in K]?: Listener<T>[] };

// a little hack to get the common props from a union
type CommonProps<T> = Pick<T, keyof T>;

/**
 * Subscribe to a particular set of values, not just state as a whole.
 * used to avoid re-rendering anything that is not associated with a particular value.
 * @param map_fn if the values are not just keys (hashable values like string, number, symbol), provide this map function
 * @typeParam K the thing all listeners are keyed by
 * @typeParam T if provided, the actual complex value stored. map_fn is required in this case.
 */
export function createValueSubscriberState<
    K extends symbol | number | string,
    T = K,
    TProp extends keyof T = keyof CommonProps<T>,
>(map_fn?: (t: T | null) => K | null | undefined) {
    const state: { state: T | null } = { state: null };
    const listeners: ListenerState<K, T> = {};
    let global_listeners: Listener<T>[] = [];

    /**
     * @param subscribers particular values that this instance is interested in. If no values are provided, then subscribe to *all* changes.
     */
    function useSubscribeValue<K2 extends K>(...subscribers: K2[]) {
        // biome-ignore lint/correctness/useExhaustiveDependencies: sorted subscribers
        const subs_memo = useMemo(() => subscribers, subscribers.toSorted());
        return useBase(subs_memo);
    }

    function useBase<K2 extends K>(subscribers: K2[] | null) {
        type X = T extends symbol | number | string ? T : Extract<T, { [p in TProp]: K2 }>;
        const [current_value, set_state] = useState<X | null>(null);

        useEffect(() => {
            // create listener function: NOTE: this might be made better if we play with typescript some more
            const listener = (x: T | null) => set_state(x as X);

            // if no ids, add self to global listeners
            if (subscribers === null) global_listeners.push(listener);
            // set up subscriptions
            else
                for (const id of subscribers) {
                    listeners[id] = [...(listeners[id] ?? []), listener];
                }

            // return cleanup function
            return () => {
                // if no ids, remove self from global listeners
                if (subscribers === null) global_listeners = global_listeners.filter((x) => x !== listener);
                // remove self from old subscribed ids
                else
                    for (const id of subscribers) {
                        listeners[id] = listeners[id]?.filter((x) => x !== listener);
                        if (listeners[id]?.length === 0) {
                            // make sure we clean up any unused values in order to prevent a memory leak
                            delete listeners[id];
                        }
                    }
            };
        }, [subscribers]);

        const set_current = useCallback(
            (value: T | null) => {
                if (value === state.state) return;
                // update old subscribers to null
                const prev_key = map_fn ? (map_fn(state.state) ?? null) : (state.state as K | null);
                if (prev_key !== null && listeners[prev_key]) for (const l of listeners[prev_key]) l(null);
                // update new subscribers with new value
                const new_key = map_fn ? (map_fn(value) ?? null) : (value as K | null);
                if (new_key !== null && listeners[new_key]) for (const l of listeners[new_key]) l(value);
                // update the global listeners
                for (const l of global_listeners) l(value);
                // record new value in state
                state.state = value;
            },
            [map_fn],
        );

        return [current_value, set_current] as const;
    }

    return Object.assign(useSubscribeValue, {
        all() {
            return useBase(null);
        },
    });
}
