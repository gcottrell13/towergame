import { useEffect, useState } from 'react';
import type { BuildingActions } from '../events/SaveFileActions.ts';

export function useBuildingTick(can_tick: () => boolean, update: (b: BuildingActions) => void, max_ticks_per_s = 4) {
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
                    if (tick_freq > 1) {
                        set_tick_freq((x) => Math.max(1, x - 1));
                    }
                } else if (delta < ms * 1.05) {
                    if (tick_freq < max_ticks_per_s) {
                        set_tick_freq((x) => Math.min(max_ticks_per_s, x + 1));
                    }
                }
            }, ms);
            return () => clearInterval(t);
        }
    }, [can_tick, update, tick_freq, max_ticks_per_s]);
}
