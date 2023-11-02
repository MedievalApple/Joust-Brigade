import { Vector } from "./vector";
import { ctx, mapBlockCollision } from "./joust";
import { Sprite } from "./sprite";

type MapObjectColor = string | CanvasGradient | CanvasPattern;

export class MapObject {
    position: Vector;
    velocity: Vector;
    width: number;
    height: number;
    color: MapObjectColor;
    sprite: Sprite;

    constructor(x: number, y: number, w: number, h: number, c: MapObjectColor, sprite?: Sprite) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.width = w;
        this.height = h;
        this.color = c;
        this.sprite = sprite;
    }

    show() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.sprite != null) {
            this.sprite.show(5, this.position.x, this.position.y);
        }
    }
}

export class Hitbox extends MapObject{
    constructor() {
        super()
        
    }
}

export { mapBlockCollision }