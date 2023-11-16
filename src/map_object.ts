import { Vector } from "./vector";
import { AniSprite, ColorSprite, ImgSprite, Sprite } from "./sprite";
import { Player } from "./player";
import { DEBUG } from "./debug";
import { Collider, ICollisionObject, OffsetHitbox } from "./collision";

interface IGameObject {
    position: Vector;
    velocity: Vector;
    collider: Collider;
    update?: () => void;
    show?: () => void;
    dumbAI?: () => void;
    dead?: boolean;
    collisionObjects?: Array<ICollisionObject>;
}

const GAME_OBJECTS: Array<IGameObject> = [];
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

        if (this.sprite instanceof ImgSprite || this.sprite instanceof ColorSprite) {
            if (!this.sprite.image) return;
            this.sprite.scale = new Vector(this.size.x / this.sprite.image.width, this.size.y / this.sprite.image.height);
            this.sprite.show(this.position.x, this.position.y);
        } else if (this.sprite instanceof AniSprite) {
            this.sprite.show(this.position.x, this.position.y);
        }
    }
}

export function addObjects(objects: Array<IGameObject>) {
    for (let object of objects) {
        GAME_OBJECTS.push(object);
    }
}

export { Collider, GAME_OBJECTS };
