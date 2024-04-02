import { canvas } from "./Global Constants/canvas";
import { Direction } from "./enums";
import { GAME_OBJECTS } from "./map_object";
import { Player } from "./Bird Objects/player";
import { AniSprite, Sprite } from "./sprite";
import { constrain } from "./utils";
import { Vector } from "./vector";

export class UnmountedAI extends Player {
    debugColor: string = "white";
    static: boolean;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        color: string,
        name: string,
        id: string
    ) {
        super(x, y, width, height, color, name, id);
        this.name = name;
        this.maxSpeed = new Vector(1.5, 5);
        // this.static = true;
        this.animations = {
            running: new AniSprite(
                "/assets/sprite_sheet/bounder/walk_unmounted/walk",
                4,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            ),
            flap: new AniSprite(
                "/assets/sprite_sheet/bounder/flap_unmounted/flap",
                2,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            )
        };

        switch (Math.floor(Math.random() * 2)) {
            case 0:
                this.direction = Direction.Right;
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
        if (Math.random() < 0.03) {
            this.isJumping = true;
            this.velocity.y = constrain(this.velocity.y - 2, -2, 2);
        }
        switch (this.position.x > canvas.width / 2) {
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
    handleCollisions(): void {
        if (this.position.x - 1 > canvas.width) {
            GAME_OBJECTS.delete(this.id);
        } else if (this.position.x < 1) {
            GAME_OBJECTS.delete(this.id);
        }
    }
}
export class Egg {
    animations: { [key: string]: Sprite }
    currentAnimation: Sprite
    id: string
    constructor(id: string) {
        this.id = id;
        this.animations = {
            hatching: new AniSprite(
                "/assets/sprite_sheet/egg/egg",
                4,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            ),
            bounder_hatching: new AniSprite(
                "/assets/sprite_sheet/egg/egg_bounder",
                3,
                {
                    animationSpeed: 5,
                    scale: new Vector(2, 2),
                    loop: true
                }
            )
        };
        this.currentAnimation = this.animations.hatching;
    }
    show(x: number, y: number) {
        this.currentAnimation.show(200, 200);
        if (performance.now() % 1000 < 16) {
            if (this.currentAnimation.currentImage < this.currentAnimation.maxImage - 1) {
                this.currentAnimation.next();
            }
            if (this.animations.hatching.currentImage == 3) {
                this.currentAnimation = this.animations.bounder_hatching;
                this.animations.hatching.currentImage = 0;
            }
        }
    }
}
GAME_OBJECTS.set("egg", new Egg("egg"));