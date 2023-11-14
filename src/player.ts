import { AniSprite } from "./sprite";
import { Vector } from "./vector";
import { ctx, canvas, GAME_OBJECTS, player } from "./joust";
import { FRAME_RATE } from "./joust";
import { Collider, OffsetHitbox } from "./map_object";
import { DEBUG } from "./debug";

export class Player {
    currentAnimation: AniSprite | null;
    animations: { [key: string]: AniSprite };
    name: string;
    velocity: Vector;
    size: Vector;
    gravity: number;
    friction: number;
    xAccel: number;
    blockInfo: { x: number; y: number; w: number; };
    maxSpeed: Vector;
    color: string;
    jumpDirection: boolean;
    isJumping: boolean;
    collider: Collider;
    position: Vector;
    oldSize: Vector;

    constructor(x: number, y: number, width: number, height: number, color: string, name: string) {
        this.currentAnimation = null;
        this.animations = {
            running: new AniSprite("/assets/sprite_sheet/ostrich/walk_ostrich/walk", 4, 15, 2),
            stop: new AniSprite("/assets/sprite_sheet/ostrich/walk_ostrich/stop", 1, 60, 2),
            flap: new AniSprite("/assets/sprite_sheet/ostrich/flap_ostrich/flap", 2, null, 2),
            idle: new AniSprite("/assets/sprite_sheet/ostrich/idle_ostrich/idle_standing", 1, null, 2)

        }

        this.name = name;
        this.velocity = new Vector(0, 0);
        this.position = new Vector(x, y);
        this.size = new Vector(width, height);
        this.gravity = 0.05;
        this.friction = 0.4;
        this.xAccel = 0;
        this.blockInfo = { x: -100, y: -100, w: -100 };
        this.maxSpeed = new Vector(3, 5)
        this.color = color;
        this.jumpDirection = false;
        this.isJumping = false;
        this.collider = new Collider();
        this.collider.hitbox = new OffsetHitbox(new Vector(), this.size);
        this.oldSize = new Vector();
        GAME_OBJECTS.unshift(this);
    }

    updateCollider(vector: Vector) {
        if (!this.collider) return;
        this.collider.position = vector
    }

    show() {
        ctx.fillStyle = this.color;

        if (DEBUG) {
            this.collider.show();
        }

        // Draw name above player, centered
        ctx.font = "10px Arial";
        ctx.fillText(this.name, this.position.x + this.size.x / 2 - ctx.measureText(this.name).width / 2, this.position.y - 20);

        if (this.isJumping) {
            this.currentAnimation = this.animations.flap;
        } else if (this.velocity.x == 0) {
            this.currentAnimation = this.animations.idle;
        } else if (Math.sign(this.velocity.x) != Math.sign(this.xAccel)) {
            this.currentAnimation = this.animations.stop;
        } else {
            this.currentAnimation = this.animations.running;
        }
        if (this.currentAnimation != this.animations.flap) {
            this.jumpDirection = false;
        }
        if (!this.currentAnimation) {
            this.currentAnimation = this.animations.running;
        }

        this.collider.hitbox.size.x = this.currentAnimation.images[0].width * 2;
        this.collider.hitbox.size.y = this.currentAnimation.images[0].height * 2;

        if (this.oldSize.y !== this.collider.hitbox.size.y) {
            console.log("Change in Animation");
            this.position = this.position.add(this.oldSize.sub(this.collider.hitbox.size));
        }

        this.oldSize = this.collider.hitbox.size.clone();

        if ((this.velocity.x < 0 && !this.isJumping) || this.jumpDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            this.currentAnimation.show(-this.position.x - this.size.x, this.position.y, Math.abs(this.velocity.x * 2), {
                size: new Vector(this.size.x, this.size.y),
                scalar: 2
            });
            ctx.restore();
        } else {
            this.currentAnimation.show(this.position.x, this.position.y, Math.abs(this.velocity.x * 2), {
                size: new Vector(this.size.x, this.size.y),
                scalar: 2
            });
        }
    }

    // Torroidal collision detection
    handleCollisions() {
        if (this.position.y + this.size.y > canvas.height) {
            this.isJumping = true;
            this.position.y = canvas.height - this.size.y;
            this.velocity.y *= -this.friction;
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= -this.friction;
        }

        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    }

    update() {
        this.velocity.y += this.gravity;
        this.velocity.x += this.xAccel;
        if (Math.abs(this.velocity.x) > this.maxSpeed.x) {
            this.velocity.x = this.maxSpeed.x * Math.sign(this.velocity.x)
        } else if (Math.sign(this.velocity.x) == Math.sign(this.xAccel) && Math.abs(this.velocity.x) < 0.5) {
            // draw sprite in direction player was going
            this.velocity.x = 0;
            this.xAccel = 0;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.handleCollisions();

        this.updateCollider(this.position);

    }

    handleLeft() {
        if (this.currentAnimation == this.animations.flap) {
            this.jumpDirection = true;
        } else {
            this.jumpDirection = false;
        }
        if (Math.abs(this.velocity.x) == 0) {
            this.velocity.x = -1;
            this.xAccel = -0.05;
        } else {
            this.xAccel = -0.07;
        }
    }

    handleRight() {
        if (this.currentAnimation == this.animations.flap) {
            this.jumpDirection = false;
        }

        if (Math.abs(this.velocity.x) == 0) {
            this.velocity.x = 1;
            this.xAccel = 0.05;
        } else {
            this.xAccel = 0.07;
        }
    }

    handleJump() {
        this.currentAnimation.currentImage++;
        this.isJumping = true;
        this.velocity.y -= 3;
        if (this.velocity.y < -3) {
            this.velocity.y = -3;
        }
    }
}

var counter = 0;

export class Enemy extends Player {
    dead: boolean;
    constructor(x: number, y: number, width: number, height: number, color: string, name?: string) {
        super(x, y, width, height, color, name);
        this.dead = false;
        this.name = `Enemy ${++counter}`
        this.animations = {
            running: new AniSprite("/assets/sprite_sheet/bounder/walk_bounder/walk", 4, null, 2),
            flap: new AniSprite("/assets/sprite_sheet/bounder/flap_bounder/flap", 2, null, 2),
            // idle: new AniSprite("/assets/Sprite Sheet/Bounder/Idle (Bounder)/Idle_Standing", 1)
        }
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
                this.jumpDirection = true;
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
                this.velocity.y -= 3;
                if (this.velocity.y < -3) {
                    this.velocity.y = -3;
                }
            } else {
                if (Math.random() < 0.1) {
                    this.isJumping = true;
                    this.velocity.y -= 3;
                    if (this.velocity.y < -3) {
                        this.velocity.y = -3;
                    }
                }
            }
        }
        switch (this.velocity.x > 0) {
            case true:
                this.jumpDirection = false;
                if (Math.abs(this.velocity.x) == 0) {
                    this.velocity.x = 1;
                    this.xAccel = 0.05;
                } else {
                    this.xAccel = 0.07;
                }
                break;
            case false:
                this.jumpDirection = true;
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
}
export function startDeathAnimation(position: Vector, velocity: Vector, isAi: boolean) {
    if (isAi) { } else {
        var unmountrunning = new AniSprite("/assets/sprite_sheet/bounder/walk_unmounted/walk", 4, null, 2);
        // var unmountflapping = new AniSprite("/assets/sprite_sheet/bounder/flap_unmounted/flap", 2, null, 2);
        loopDeath(unmountrunning, position);
    }
}
function loopDeath(sprite: AniSprite, position: Vector) {
    sprite.show(position.x, position.y, 2, {
        size: new Vector(12 * 2, 13 * 2),
        scalar: 2
    });
    this.collider.hitbox = new OffsetHitbox(new Vector(), this.size);
    setTimeout(() => { loopDeath(sprite, position) }, 1000 / FRAME_RATE);
}
export class DeathAnimation {
    position: Vector;
    velocity: Vector;
    unmountrunning: AniSprite;

    constructor(position: Vector, velocity: Vector) {
        this.position = position;
        this.velocity = velocity;
        this.unmountrunning = new AniSprite("/assets/sprite_sheet/bounder/walk_unmounted/walk", 4, null, 2);
    }
    show() {
        this.unmountrunning.show(2, this.position.x, this.position.y, {
            size: new Vector(12 * 2, 13 * 2),
            scalar: 2
        });
    }

}