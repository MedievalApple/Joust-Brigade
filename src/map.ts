console.log("map.ts loaded");

import { Collider, MapObject, addObjects } from "./map_object";
import { canvas, ctx } from "./joust";
import { ImgSprite, Sprite } from "./sprite";
import { Vector } from "./vector";

// Platforms
addObjects([
    new MapObject(0, 72, 49, 15, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_1.png")), //1
    new MapObject(132, 99, 143, 22, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_2.png")), //2
    new MapObject(403, 73, 74, 12, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_3.png")), //3
    new MapObject(0, 225, 100, 17, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_4.png")), //4
    new MapObject(165, 282, 103, 17, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_5.png")), //5
    new MapObject(321, 205, 94, 25, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_6.png")), //6
    new MapObject(409, 225, 71, 15, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_7.png")), //7
    new MapObject(-10, 388, canvas.width + 10, 100, new Collider()), // Ground
    new MapObject(91, 388, 298, 60, new Collider(), new ImgSprite("/assets/sprite_sheet/map/platform_8.png")), //8
]);

// new Block(79, 388, 303, 100, null); //8