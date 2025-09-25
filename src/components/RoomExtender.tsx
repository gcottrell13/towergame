import { useEffect, useState } from 'react';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { clamp } from '../clamp.ts';
import type { RoomDefinition } from '../types/RoomDefinition.ts';
import { as_uint_or_default } from '../types/RestrictedTypes.ts';

export function useRoomExtender(
    room_def: RoomDefinition,
    on_click?: () => void,
    on_cancel?: () => void,
) {
    const [width, set_width] = useState(room_def.min_width);
    const [height, set_height] = useState(room_def.min_height);

    useEffect(() => {
        set_width(room_def.min_width);
        set_height(room_def.min_height);
    }, [room_def]);

    const jsx = (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            onMouseMove={(event) => {
                const w_units = Math.ceil(
                    event.nativeEvent.offsetX / PIXELS_PER_UNIT,
                );
                set_width(
                    as_uint_or_default(
                        clamp(
                            Math.ceil(w_units / room_def.width_multiples_of) *
                                room_def.width_multiples_of,
                            room_def.min_width,
                            room_def.max_width,
                        ),
                    ),
                );
                set_height(
                    as_uint_or_default(
                        clamp(
                            room_def.max_height -
                                Math.floor(
                                    event.nativeEvent.offsetY / FLOOR_HEIGHT
                                ),
                            room_def.min_height,
                            room_def.max_height,
                        ),
                    ),
                );
            }}
            onContextMenu={(ev) => {
                ev.preventDefault();
                on_cancel?.call(null);
                set_height(room_def.min_height);
                set_width(room_def.min_width);
            }}
            onClick={(ev) => {
                ev.preventDefault();
                on_click?.call(null);
                set_height(room_def.min_height);
                set_width(room_def.min_width);
            }}
            style={{
                width: `${room_def.max_width * PIXELS_PER_UNIT}px`,
                height: `${room_def.max_height * FLOOR_HEIGHT}px`,
                position: 'absolute',
                top: `-${(room_def.max_height - 1) * FLOOR_HEIGHT}px`,
                background: 'color-mix(in srgb, lawngreen 30%, transparent)',
            }}
        ></div>
    );

    return {
        extension_overlay: jsx,
        width,
        height,
    };
}
