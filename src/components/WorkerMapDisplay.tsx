import type { uint } from '../types/RestrictedTypes.ts';
import { TOWER_WORKER_DEFS, type TowerWorkerKind } from '../types/TowerWorkerDefinition.ts';

interface Props {
    resources: { [p in TowerWorkerKind]: uint };
    show_counts?: boolean;
    style?: React.CSSProperties;
}

const img_size: React.CSSProperties = {
    width: '1em',
    height: '1em',
};
const flex: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
};

export function WorkerMapDisplay({ resources, style, show_counts = true }: Props) {
    return (
        <>
            {Object.values(TOWER_WORKER_DEFS).map((def) => {
                const r = resources[def.kind];
                if (!r) return null;
                return (
                    <span key={def.kind} style={{ ...flex, ...style }}>
                        <img style={img_size} src={def.sprite_stationary} alt={def.kind} />
                        <span>{show_counts ? r : null}</span>
                    </span>
                );
            })}
        </>
    );
}
