import type {int, uint} from './RestrictedTypes.ts';
import type { SMap } from './SMap.ts';
import type {Building} from "./Building.ts";

export interface SaveFile {
  money: int;
  rating: uint;
  new_things_acked: SMap<string>;
  buildings: Building[];
}
