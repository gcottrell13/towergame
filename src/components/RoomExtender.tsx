import { useEffect, useState } from 'react';
import { clamp } from '../clamp.ts';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT } from '../constants.ts';
import { as_uint_or_default, type uint } from '../types/RestrictedTypes.ts';

interface HasWidth {
    min_width: uint;
    min_height: uint;
    max_width?: uint;
    max_height: uint;
    width_multiples_of?: uint;
}

export function useRoomExtender(has_width: HasWidth, on_click?: () => void, on_cancel?: () => void) {
    const [width, set_width] = useState(has_width.min_width);
    const [height, set_height] = useState(has_width.min_height);

    useEffect(() => {
        set_width(has_width.min_width);
        set_height(has_width.min_height);
    }, [has_width]);

    const jsx = (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
            onMouseMove={(event) => {
                const w_units = Math.ceil(event.nativeEvent.offsetX / PIXELS_PER_UNIT);
                set_width(
                    as_uint_or_default(
                        clamp(
                            has_width.width_multiples_of
                                ? Math.ceil(w_units / has_width.width_multiples_of) * has_width.width_multiples_of
                                : w_units,
                            has_width.min_width,
                            has_width.max_width ?? has_width.min_width,
                        ),
                    ),
                );
                set_height(
                    as_uint_or_default(
                        clamp(
                            has_width.max_height - Math.floor(event.nativeEvent.offsetY / FLOOR_HEIGHT),
                            has_width.min_height,
                            has_width.max_height,
                        ),
                    ),
                );
            }}
            onContextMenu={(ev) => {
                ev.preventDefault();
                on_cancel?.call(null);
                set_height(has_width.min_height);
                set_width(has_width.min_width);
            }}
            onClick={(ev) => {
                ev.preventDefault();
                on_click?.call(null);
                set_height(has_width.min_height);
                set_width(has_width.min_width);
            }}
            style={{
                width: `${(has_width.max_width ?? has_width.min_width) * PIXELS_PER_UNIT}px`,
                height: `${has_width.max_height * FLOOR_HEIGHT}px`,
                position: 'absolute',
                top: `-${(has_width.max_height - 1) * FLOOR_HEIGHT}px`,
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
