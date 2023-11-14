import { Vector } from "./vector";
import { ctx, GAME_OBJECTS } from "./joust";
import { AniSprite, ImgSprite, Sprite } from "./sprite";
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
    friction: number = 0.6;

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
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.collisionX, this.collisionY, this.collisionSize.x, this.collisionSize.y);
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
            ctx.fillStyle = "red";
            // this.collider.show();
            // ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        }

        if (this.sprite instanceof ImgSprite) {
            if (!this.sprite.image) return;
            this.sprite.scale = new Vector(this.size.x / this.sprite.image.width, this.size.y / this.sprite.image.height);
            this.sprite.show(this.position.x, this.position.y);
        } else if (this.sprite instanceof AniSprite) {
            this.sprite.show(this.position.x, this.position.y, 5);
        
        }
    }
}

export function addObjects(objects: Array<MapObject | Player>) {
    for (let object of objects) {
        GAME_OBJECTS.push(object);
    }
}