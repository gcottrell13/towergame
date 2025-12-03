import { FLOOR_DEFS, type FloorKind } from '../../types/FloorDefinition.ts';

interface Props {
    floor_kind: FloorKind;
}
export function EncyclopediaFloor({ floor_kind }: Props) {
    const def = FLOOR_DEFS.buildables[floor_kind];
    return (
        <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
            <span>{def.name}</span>
            <span>{def.readme}</span>
        </div>
    );
}
