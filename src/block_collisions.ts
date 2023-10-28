import { Vector } from "./vector";
import { ctx, mapBlockCollision } from "./joust";

export class BlockCollision {
    position: any;
    velocity: any;
    width: any;
    height: any;
    color: any;
    sprite: any;

    constructor(x: number, y: number, w: number, h: number, c: any, sprite?: any) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.width = w;
        this.height = h;
        this.color = c;
        this.sprite = sprite;

        mapBlockCollision.push(this);
    }

    show () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.sprite != null) {
            this.sprite.show(5, this.position.x, this.position.y);
        }
    }
}