import { RESOURCE_DEFS, type ResourceMap } from '../types/ResourceDefinition.ts';
import type { uint } from '../types/RestrictedTypes.ts';

interface Props {
    resources: ResourceMap<uint>;
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

export function ResourceMapDisplay({ resources, style, show_counts = true }: Props) {
    return (
        <>
            {Object.values(RESOURCE_DEFS).map((def) => {
                const r = resources[def.kind];
                if (!r) return null;
                return (
                    <span key={def.kind} style={{ ...flex, ...style }}>
                        <img style={img_size} src={def.sprite} alt={def.kind} />
                        <span>{show_counts ? r : null}</span>
                    </span>
                );
            })}
        </>
    );
}
