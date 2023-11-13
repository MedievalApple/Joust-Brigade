import { Vector } from "./vector";
import { ctx, GAME_OBJECTS } from "./joust";
import { Sprite } from "./sprite";
import { Player } from "./player";
import { DEBUG } from "./debug";

export interface IHitbox {
    offset: Vector;
    size: Vector;
}

export class OffsetHitbox implements IHitbox {
    offset: Vector;
    size: Vector;

    constructor(offset: Vector, size: Vector) {
        this.offset = offset;
        this.size = size;
    }
}

export class Collider {
    position: Vector;
    hitbox: IHitbox;

    get collisionX() {
        return this.position.x + this.hitbox.offset.x;
    }

    get collisionY() {
        return this.position.y + this.hitbox.offset.y;
    }

    get collisionSize() {
        return this.hitbox.size;
    }

    show() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.collisionX, this.collisionY, this.hitbox.size.x, this.hitbox.size.y);
    }
}

export class MapObject {
    position: Vector;
    velocity: Vector;
    size: Vector;
    sprite: Sprite;
    collider: Collider;
    static: boolean = true;

    constructor(x: number, y: number, w: number, h: number, collider: Collider, sprite?: Sprite) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.size = new Vector(w, h);
        this.sprite = sprite;
        this.collider = collider;
        this.collider.position = this.position;
        this.collider.hitbox = new OffsetHitbox(new Vector(), this.size);
    }

    show() {
        if (DEBUG) {
            this.collider.show();
        }
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        if (this.sprite != null) {
            this.sprite.show(5, this.position.x, this.position.y);
        }
    }
}

export function addObjects(objects: Array<MapObject | Player>) {
    for (let object of objects) {
        GAME_OBJECTS.push(object);
    }
}