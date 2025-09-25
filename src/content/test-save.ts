import type { SaveFile } from '../types/SaveFile.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';

export const TEST_SAVE: SaveFile = {
    buildings: [
        {
            id: 0 as uint,
            name: 'building',
            max_width: 30 as uint,
            position: 50 as int,
            top_floor: 2 as uint,
            floors: [
                {
                    height: 2 as int,
                    kind: 'basic' as any,
                    rooms: [],
                    size_left: 8 as uint,
                    size_right: 8 as uint,
                },
                {
                    height: 1 as int,
                    kind: 'basic' as any,
                    rooms: [],
                    size_left: 20 as uint,
                    size_right: 20 as uint,
                },
                {
                    height: 0 as int,
                    kind: null,
                    rooms: [],
                    size_left: 23 as uint,
                    size_right: 20 as uint,
                },
            ],
        },
    ],
    money: 1000 as int,
    new_things_acked: {},
    rating: 0 as uint,
};
