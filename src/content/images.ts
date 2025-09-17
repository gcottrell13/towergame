import basic_floor_bg_png from './assets/basic-floor-bg.png';
import bestviewedcomp_gif from './assets/bestviewedcomp.gif';
import empty_floor_bg_png from './assets/empty-floor-bg.png';
import roof1_png from './assets/roof1.png';
import room_hotel_basic_small_empty_png from './assets/room-hotel-basic-small-empty.png';
import room_hotel_basic_small_occupied_png from './assets/room-hotel-basic-small-occupied.png';
import stairwell1_png from './assets/stairwell1.png';
const images = {
	"basic-floor-bg.png": basic_floor_bg_png,
	"bestviewedcomp.gif": bestviewedcomp_gif,
	"empty-floor-bg.png": empty_floor_bg_png,
	"roof1.png": roof1_png,
	"room-hotel-basic-small-empty.png": room_hotel_basic_small_empty_png,
	"room-hotel-basic-small-occupied.png": room_hotel_basic_small_occupied_png,
	"stairwell1.png": stairwell1_png,
};
export type IMAGES = keyof typeof images;
export default images as {[p: string]: string};
