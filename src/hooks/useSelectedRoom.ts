import type { RoomId } from '../types/Room.ts';
import { createValueSubscriberState } from './useSubscribeValue.ts';

export const useSelectedRoom = createValueSubscriberState<RoomId>();
