import type { SaveFile } from '../types/SaveFile.ts';
import type { int, uint } from '../types/RestrictedTypes.ts';

export const TEST_SAVE: SaveFile = {
    buildings: [
        {
            id: 0 as uint,
            name: 'building',
            max_width: 10 as uint,
            position: 50 as int,
            roof_height: 3 as uint,
            floors: [
                {
                    height: 3 as int,
                    kind: 'basic' as any,
                    rooms: [
                        {
                            state: 0,
                            kind: 'ad-1' as any,
                            position: -4 as int,
                            height: 1 as uint,
                            width: 4 as uint,
                            bottom_floor: 3 as int,
                        },
                    ],
                    size_left: 10 as uint,
                    size_right: 10 as uint,
                },
                {
                    height: 2 as int,
                    kind: 'basic' as any,
                    rooms: [],
                    size_left: 15 as uint,
                    size_right: 15 as uint,
                },
                {
                    height: 1 as int,
                    kind: null,
                    rooms: [],
                    size_left: 20 as uint,
                    size_right: 20 as uint,
                },
            ],
        },
    ],
    money: 1000 as int,
    new_things_acked: {},
    rating: 0 as uint,
};
