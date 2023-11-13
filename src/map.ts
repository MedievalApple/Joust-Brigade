console.log("map.ts loaded");

import { Collider, MapObject, addObjects } from "./map_object";
import { canvas, ctx } from "./joust";
import { ImgSprite, Sprite } from "./sprite";
import { Vector } from "./vector";

// Platforms
addObjects([
    new MapObject(0, 72, 49, 15, new Collider()),
    new MapObject(132, 99, 143, 22, new Collider()), //2
    new MapObject(403, 73, 77, 22, new Collider()), //3
    new MapObject(0, 225, 100, 17, new Collider()), //4
    new MapObject(165, 282, 103, 17, new Collider()), //5
    new MapObject(321, 205, 94, 25, new Collider()), //6
    new MapObject(409, 225, 71, 15, new Collider()), //7
]);
// new Block(79, 388, 303, 100, null); //8