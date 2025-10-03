import type { Transportation } from '../types/Transportation.ts';
import { memo } from 'react';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';
import { FLOOR_HEIGHT, PIXELS_PER_UNIT, Z_INDEX } from '../constants.ts';

interface Props {
    transport: Transportation;
}

export function TransportationComponent({ transport }: Props) {
    const t_def = TRANSPORT_DEFS[transport.kind];

    return (
        <div
            className="fit-content no-sel"
            id={`${transport.kind}-${transport.position}`}
            style={{
                left: `${transport.position * PIXELS_PER_UNIT}px`,
                top: `${-(transport.height - 1) * FLOOR_HEIGHT}px`,
                backgroundRepeat: 'repeat',
                width: `${t_def.min_width * PIXELS_PER_UNIT}px`,
                height: `${transport.height * FLOOR_HEIGHT}px`,
                backgroundImage: `url(${t_def.sprite_empty})`,
                position: 'absolute',
                backgroundSize: `${t_def.min_width * PIXELS_PER_UNIT}px ${FLOOR_HEIGHT}px`,
                zIndex: Z_INDEX.rooms,
            }}
        ></div>
    );
}

export const TransportationComponentMemo = memo(TransportationComponent);
