import { Vector } from "./vector";
import { ctx, mapBlockCollision } from "./joust";
import { Sprite } from "./sprite";

type MapObjectColor = string | CanvasGradient | CanvasPattern;

export interface IHitbox {
    offset: Vector;
    size: Vector;
}

export class OffsetHitbox implements IHitbox {
    offset: Vector;
    size: Vector;

    constructor(parentPosition: Vector, offset: Vector, size: Vector) {
        this.offset = parentPosition.add(offset);
        this.size = size;
    }
}

export class Collider {
    position: Vector;
    private hitbox: IHitbox;

    get collisionX() {
        return this.position.x + this.hitbox.offset.x;
    }

    get collisionY() {
        return this.position.y + this.hitbox.offset.y;
    }

    get collisionSize() {
        return this.hitbox.size;
    }
}

export class MapObject {
    position: Vector;
    velocity: Vector;
    size: Vector;
    sprite: Sprite;
    collider: Collider;

    constructor(x: number, y: number, w: number, h: number, collider: Collider, sprite?: Sprite) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(w, h);
        this.sprite = sprite;
        this.collider = collider;

        // mapBlockCollision.push(this.hitbox);
    }



    show() {
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        if (this.sprite != null) {
            this.sprite.show(5, this.position.x, this.position.y);
        }
    }
}

export { mapBlockCollision }