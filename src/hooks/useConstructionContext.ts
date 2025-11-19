import type { FloorKind } from '../types/FloorDefinition.ts';
import type { RoomKind } from '../types/RoomDefinition.ts';
import type { TransportationKind } from '../types/TransportationDefinition.ts';
import { createValueSubscriberState } from './useSubscribeValue.ts';

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
type Full = map_distribute<keyof STATE_TYPE>;

/**
 * subscribe to just the construction contexts that you need
 * @param keys
 */
export const useConstructionContext = createValueSubscriberState<keyof STATE_TYPE, Full>((x) => x?.type);
