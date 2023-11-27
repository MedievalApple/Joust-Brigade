import { AniSprite, ImgSprite, Sprite } from "./sprite";
import { Vector } from "./vector";
import {
    ctx,
    canvas,
    GAME_OBJECTS,
    player,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
} from "./joust";
import { FRAME_RATE } from "./joust";
import { Collider } from "./map_object";
import { DEBUG } from "./debug";
import { OffsetHitbox, ICollisionObject } from "./collision";
import { constrain } from "./utils";
import { Direction } from "./enums";

export class Player {
    currentAnimation: Sprite | null;
    animations: { [key: string]: Sprite } = {
        running: new AniSprite(
            "/assets/sprite_sheet/ostrich/walk_ostrich/walk",
            4,
            {
                animationSpeed: 10,
                scale: new Vector(2, 2),
                loop: true
            }
        ),
        stop: new ImgSprite("/assets/sprite_sheet/ostrich/walk_ostrich/stop.png", new Vector(2, 2)),
        flap: new AniSprite(
            "/assets/sprite_sheet/ostrich/flap_ostrich/flap",
            2,
            {
                animationSpeed: 0,
                scale: new Vector(2, 2),
                loop: true
            }
        ),
        idle: new ImgSprite("/assets/sprite_sheet/ostrich/idle_ostrich/idle_standing.png", new Vector(2, 2)),
    };
    name: string;
    velocity: Vector = new Vector(0, 0);
    size: Vector;
    gravity: number = 0.05;
    friction: number = 0.4;
    xAccel: number = 0;
    maxSpeed: Vector = new Vector(3, 5);
    color: string;
    direction: Direction = Direction.Right;
    isJumping: boolean = false;
    position: Vector;
    oldSize: Vector = new Vector();
    collider: Collider;
    lance: Collider;
    head: Collider;
    collisionObjects: Array<ICollisionObject> = [];
    debugColor: string = "red";
    jumpDebounce: boolean;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        name: string
    ) {
        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
        this.color = color;
        this.name = name;

        this.collider = new Collider();
        this.collider.hitbox = new OffsetHitbox(new Vector(), this.size);

        this.lance = new Collider();
        this.lance.hitbox = new OffsetHitbox(
            new Vector(14, 6),
            new Vector(12, 6)
        );

        this.head = new Collider();
        this.head.hitbox = new OffsetHitbox(
            new Vector(4, 0),
            new Vector(18, 6)
        );

        GAME_OBJECTS.unshift(this);
    }

    toggleDirection(): Direction {
        return this.direction === Direction.Left
            ? Direction.Right
            : Direction.Left;
    }

    updateCollider(vector: Vector) {
        if (this.collider) this.collider.position = vector;

        if (this.lance) {
            this.lance.position = vector;

            if (this.velocity.x < 0 && !this.isJumping) {
            } else {
                this.lance.hitbox.offset = new Vector(14, 6);
            }
        }

        if (this.head) this.head.position = vector;
    }

    show() {
        ctx.fillStyle = this.color;

        // Draw name above player, centered
        if(this.name){
            ctx.font = "10px Arial";
            ctx.fillText(
                this.name,
                this.position.x +
                this.size.x / 2 -
                ctx.measureText(this.name).width / 2,
                this.position.y - 20
            );
        }

        this.updateCurrentAnimation();
        if (!this.currentAnimation) return console.error("No current animation");

        if (this.currentAnimation instanceof AniSprite) {
            this.collider.hitbox.size.x =
                this.currentAnimation.images[0].width * 2;
            this.collider.hitbox.size.y =
                this.currentAnimation.images[0].height * 2;
        } else {
            this.collider.hitbox.size.x =
                this.currentAnimation.image.width * 2;
            this.collider.hitbox.size.y =
                this.currentAnimation.image.height * 2;
        }

        if (this.oldSize.y !== this.collider.hitbox.size.y) {
            console.log("Change in Animation");
            this.position = this.position.add(
                this.oldSize.sub(this.collider.hitbox.size)
            );

        }

        this.oldSize = this.collider.hitbox.size.clone();
        if (this.currentAnimation instanceof AniSprite && this.currentAnimation == this.animations.running) { 
            this.currentAnimation.animationSpeed = 6-Math.abs(this.velocity.x)
        };
        if (
            (this.velocity.x < 0 && !this.isJumping) ||
            this.direction == Direction.Left
        ) {
            ctx.save();
            ctx.scale(-1, 1);
            this.currentAnimation.show(
                -this.position.x - this.size.x,
                this.position.y,
            );
            ctx.restore();
        } else {
            this.currentAnimation.show(
                this.position.x,
                this.position.y,
            );
        }

        this.drawDebugVisuals();
    }

    updateCurrentAnimation() {
        if (this.isJumping) {
            this.currentAnimation = this.animations.flap;
        } else if (this.velocity.x === 0) {
            this.currentAnimation = this.animations.idle;

        } else if (Math.sign(this.velocity.x) !== Math.sign(this.xAccel)) {
            this.currentAnimation = this.animations.stop;
        } else {
            this.currentAnimation = this.animations.running;
            if (this.velocity.x > 0) {
                this.direction = Direction.Right;
            } else {
                this.direction = Direction.Left;
            }
        }

        if (!this.currentAnimation) {
            this.currentAnimation = this.animations.idle;
        }
    }

    // Torroidal collision detection
    handleCollisions() {
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    }

    update() {
        this.updateCollider(this.position);

        this.velocity.y += this.gravity;
        this.velocity.x += this.xAccel;

        if (Math.abs(this.velocity.x) > this.maxSpeed.x) {
            this.velocity.x = this.maxSpeed.x * Math.sign(this.velocity.x);
        } else if (
            Math.sign(this.velocity.x) == Math.sign(this.xAccel) &&
            Math.abs(this.velocity.x) < 0.5
        ) {
            // draw sprite in direction player was going
            this.velocity.x = 0;
            this.xAccel = 0;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.handleCollisions();
    }

    handleLeft() {
        if (this.isJumping) {
            this.direction = Direction.Left;
        }

        if (Math.abs(this.velocity.x) == 0) {
            this.velocity.x = -1;
            this.xAccel = -0.05;
        } else {
            this.xAccel = -0.07;
        }
    }

    handleRight() {
        if (this.isJumping) {
            this.direction = Direction.Right;
        }

        if (Math.abs(this.velocity.x) == 0) {
            this.velocity.x = 1;
            this.xAccel = 0.05;
        } else {
            this.xAccel = 0.07;
        }
    }

    jumpKeyDown() {
        if (!this.jumpDebounce) {
            this.isJumping = true;
            this.velocity.y = constrain(this.velocity.y - 2, -2, 2);

            if (this.currentAnimation instanceof AniSprite) this.currentAnimation.next();
            this.jumpDebounce = true
        }
    }

    jumpKeyUp() {
        this.jumpDebounce = false
    }

    drawDebugVisuals() {
        if (DEBUG) {
            this.collider.show(this.debugColor);
            this.lance.show();
            this.head.show();
        }
    }
}

export class EnemyHandler {
    enemies: Enemy[] = [];

    constructor(startingEnemies: number = 0) {
        for (let i = 0; i < startingEnemies; i++) {
            this.createEnemy();
        }
    }

    createEnemy() {
        this.enemies.push(
            new Enemy(
                Math.random() * canvas.width,
                20,
                PLAYER_WIDTH,
                PLAYER_HEIGHT,
                "green"
            )
        );
    }
}

var counter = 0;

export class Enemy extends Player {
    private _dead: boolean = false;
    debugColor: string = "white";

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        name?: string
    ) {
        super(x, y, width, height, color, name);
        this.dead = false;
        this.name = `Enemy ${++counter}`;
        this.animations = {
            running: new AniSprite(
                "/assets/sprite_sheet/bounder/walk_bounder/walk",
                4,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            ),
            flap: new AniSprite(
                "/assets/sprite_sheet/bounder/flap_bounder/flap",
                2,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            ),
            // idle: new AniSprite("/assets/Sprite Sheet/Bounder/Idle (Bounder)/Idle_Standing", 1)
        };

        switch (Math.floor(Math.random() * 2)) {
            case 0:
                if (this.velocity.x == 0) {
                    this.velocity.x = 1;
                    this.xAccel = 0.05;
                } else {
                    this.xAccel = 0.07;
                }
                break;
            case 1:
                this.direction = Direction.Left;
                if (Math.abs(this.velocity.x) == 0) {
                    this.velocity.x = -1;
                    this.velocity.x = -0.05;
                } else {
                    this.xAccel = -0.07;
                }
                break;
            default:
                break;
        }
    }

    dumbAI() {
        if (Math.random() < 0.1) {
            if (this.position.y > player.position.y) {
                this.isJumping = true;
                this.velocity.y = constrain(this.velocity.y - 2, -2, 2);
            } else {
                if (Math.random() < 0.1) {
                    this.isJumping = true;
                    this.velocity.y = constrain(this.velocity.y - 2, -2, 2);
                }
            }
        }
        switch (this.velocity.x > 0) {
            case true:
                this.direction = Direction.Right;
                if (Math.abs(this.velocity.x) == 0) {
                    this.velocity.x = 1;
                    this.xAccel = 0.05;
                } else {
                    this.xAccel = 0.07;
                }
                break;
            case false:
                this.direction = Direction.Left;
                if (Math.abs(this.velocity.x) == 0) {
                    this.velocity.x = -1;
                    this.xAccel = -0.05;
                } else {
                    this.xAccel = -0.07;
                }
                break;
            default:
                break;
        }
    }

    set dead(value: boolean) {
        this._dead = value;

        if (this._dead) {
            // Delete enemy from GAME_OBJECTS
            GAME_OBJECTS.splice(GAME_OBJECTS.indexOf(this), 1);
        }
    }

    get dead(): boolean {
        return this._dead;
    }
}