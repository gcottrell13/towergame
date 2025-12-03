import isEmpty from 'lodash/isEmpty';
import { ROOM_DEFS, type RoomDefinition, type RoomKind } from '../../types/RoomDefinition.ts';
import { ResourceMapDisplay } from '../ResourceMapDisplay.tsx';

interface Props {
    room_kind: RoomKind;
}

export function EncyclopediaRoom({ room_kind }: Props) {
    const def = ROOM_DEFS[room_kind];
    const props = {
        // this object helps us make sure that we don't add a property to the room definition then forget to add it here.
        // some null props are OK, but it has to be explicit here.
        // some props may be combined into one display; this is also fine.
        sprite_active: null,
        display_name: def.display_name,
        readme: def.readme,
        production: !isEmpty(def.production) ? (
            <div>
                Produce <ResourceMapDisplay resources={def.production} />
            </div>
        ) : null,
        max_productions_per_day: def.max_productions_per_day ? (
            <div>Produce Max {def.max_productions_per_day} times per day</div>
        ) : null,
        produce_to_wallet: null,
        workers_produced: null,
        workers_required: null,
        resource_requirements: null,
        upgrades: null,
        cost_to_build: null,
        min_height: null,
        min_width: null,
        width_multiples_of: null,
        sprite_empty: null,
        max_width: null,
        overlay: null,
        build_thumb: null,
        sprite_empty_night: null,
        sprite_active_night: null,
        max_height: null,
        category: null,
        d: null,
        id: null,
        tier: null,
    } satisfies { [p in keyof RoomDefinition]: React.ReactNode };
    return (
        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            {Object.entries(props)
                .filter(([, value]) => value)
                .map(([key, value]) => (
                    <span key={key}>{value}</span>
                ))}
        </div>
    );
}
