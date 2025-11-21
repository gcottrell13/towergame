import { memo, useEffect, useState } from 'react';
import type { TowerWorker } from '../types/TowerWorker.ts';
import { TOWER_WORKER_DEFS } from '../types/TowerWorkerDefinition.ts';
import { hori, verti } from '../logic/positioning.ts';

interface Props {
    worker: TowerWorker;
}

function TowerWorkerComponent({ worker }: Props) {
    const [floor, pos] = worker.position;
    const [, npos] = worker.next_step ?? worker.destination;
    const [spawning, set_spawning] = useState(true);
    const def = TOWER_WORKER_DEFS[worker.kind];
    const speed = worker.stats?.speed ?? def.movement_speed;
    const sprite = spawning ? def.sprite_stationary : def.sprite_moving;
    const style: React.CSSProperties = {
        left: spawning ? hori(pos) : hori(npos),
        top: verti(-floor),
        transition: `left ${Math.abs(npos - pos) / speed}s linear`,
        animationPlayState: 'inherit',
    };
    useEffect(() => {
        setTimeout(() => {
            set_spawning(false);
        }, 100);
    }, []);
    return <img style={style} src={sprite} alt={worker.kind} />;
}

export const TowerWorkerComponentMemo = memo(TowerWorkerComponent);
