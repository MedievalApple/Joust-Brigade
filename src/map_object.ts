import { Vector } from "./vector";
import { AniSprite, ColorSprite, ImgSprite, Sprite } from "./sprite";
import { DEBUG } from "./debug";
import { Collider, ICollisionObject, OffsetHitbox } from "./collision";
import { PLAYER_HEIGHT, PLAYER_WIDTH } from "./Global Constants/constants";
import { Enemy, Player } from "./Bird Objects/player";
import { Egg } from "./death";

export type IGameObject = Player | Enemy | Platform | Egg;

const GAME_OBJECTS: Map<string, IGameObject> = new Map();
export class MapObject {
    position: Vector;
    velocity: Vector;
    size: Vector;
    sprite: Sprite;
    collider: Collider;
    static: boolean = true;
    id: string = Math.random().toString(36).substring(2,9);

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

export class Platform extends MapObject {
    spawner: Collider;
    constructor(x: number, y: number, w: number, h: number, collider: Collider, sprite?: Sprite, spawnerX?: number) {
        super(x, y, w, h, collider, sprite);
        this.static = true;
        if (spawnerX) {
            this.spawner = new Collider();
            this.spawner.position = this.position.clone();
            this.spawner.position.x += spawnerX;
            this.spawner.hitbox = new OffsetHitbox(new Vector(0, -PLAYER_HEIGHT), new Vector(PLAYER_WIDTH, PLAYER_HEIGHT));
        }
    }
    show(): void {
        super.show();
    
        if (DEBUG && this.spawner) {
            this.spawner.show();
        }
    }
}

export function addObjects(objects: Array<IGameObject>) {
    for (let object of objects) {
        // GAME_OBJECTS.push(object);
        GAME_OBJECTS.set(object.id, object);
    }
}

// Sort function that return an array of all type of objects in the GAME_OBJECTS array
export function filter<T extends IGameObject>(type: new (...args: any[]) => T): T[] {
    return Array.from(GAME_OBJECTS.values()).filter((object) => object.constructor == type) as T[];
}
// export function filter(predicate: (value: IGameObject, index: number, array: IGameObject[]) => unknown) {
//     return GAME_OBJECTS.filter(predicate);
// }

export { Collider, GAME_OBJECTS };
