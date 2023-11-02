console.log("map.ts loaded");

import { MapObject } from "./map_object";
import { canvas, ctx } from "./joust";
import { ImgSprite, Sprite } from "./sprite";
import { Vector } from "./vector";

// Platforms
new MapObject(0, 72, 49, 15, "null")
new MapObject(132, 99, 143, 22, "null"); //2
new MapObject(403, 73, 77, 22, "null"); //3
new MapObject(0, 225, 100, 17, "null"); //4
new MapObject(165, 282, 103, 17, "null"); //5
new MapObject(321, 205, 94, 25, "null"); //6
new MapObject(409, 225, 71, 15, "null"); //7
// new Block(79, 388, 303, 100, null); //8
const ground = new MapObject(-5, 388, canvas.width + 5, 100, "red", new ImgSprite("/assets/sprite_sheet/map/map.png")); //Test


export { ground }