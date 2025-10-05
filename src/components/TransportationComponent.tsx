import { memo } from 'react';
import { Z_INDEX } from '../constants.ts';
import { hori, verti } from '../logicFunctions.ts';
import type { Transportation } from '../types/Transportation.ts';
import { TRANSPORT_DEFS } from '../types/TransportationDefinition.ts';

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
                left: hori(transport.position),
                top: verti(-(transport.bottom_floor + transport.height)),
                backgroundRepeat: 'repeat',
                width: hori(t_def.min_width),
                height: verti(transport.height),
                backgroundImage: `url(${t_def.sprite_empty})`,
                position: 'absolute',
                backgroundSize: `${hori(t_def.min_width)} ${verti(1)}`,
                zIndex: Z_INDEX.rooms,
            }}
        />
    );
}

export const TransportationComponentMemo = memo(TransportationComponent);
