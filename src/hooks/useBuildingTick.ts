import { useEffect, useState } from 'react';
import type { BuildingActions } from '../events/SaveFileActions.ts';

export function useBuildingTick(can_tick: () => boolean, update: (b: BuildingActions) => void) {
    // decrease the tick rate if ticks are happening slower than the current tick rate.
    // or increase tick rate if possible.
    const [tick_freq, set_tick_freq] = useState(4);
    useEffect(() => {
        if (can_tick()) {
            let now = Date.now();
            const ms = 1000 / tick_freq;
            const t = setInterval(() => {
                const n = Date.now();
                const delta = n - now;
                now = n;
                update({ action: 'tick-building-time', delta });
                if (delta > ms * 1.5) {
                    // adjust this constant as needed
                    set_tick_freq((x) => Math.max(1, x - 1));
                }
            }, ms);
            return () => clearInterval(t);
        }
    }, [can_tick, update, tick_freq]);
}
