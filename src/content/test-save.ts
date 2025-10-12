import { Default as building } from '../types/Building.ts';
import { Default as floor } from '../types/Floor.ts';
import type { FloorKind } from '../types/FloorDefinition.ts';
import type { ResourceMap } from '../types/ResourceDefinition.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';
import type { SaveFile } from '../types/SaveFile.ts';

export const TEST_SAVE: SaveFile = {
    buildings: [
        {
            ...building(),
            name: 'building',
            max_width: 30 as uint,
            position: 50 as int,
            top_floor: 2 as int,
            max_height: 10 as uint,
            bank: { coin: 1000 } as ResourceMap<uint>,
            new_things_acked: {},
            floors: [
                {
                    ...floor(),
                    height: 2 as int,
                    kind: 'basic' as FloorKind,
                    size_left: 8 as uint,
                    size_right: 8 as uint,
                },
                {
                    ...floor(),
                    height: 1 as int,
                    kind: 'basic' as FloorKind,
                    size_left: 20 as uint,
                    size_right: 20 as uint,
                },
                {
                    ...floor(),
                    height: 0 as int,
                    size_left: 23 as uint,
                    size_right: 20 as uint,
                },
            ],
        },
    ],
};
