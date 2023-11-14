import { ctx } from "./joust";
import { Vector } from "./vector";

type AniSpriteOptions = {
    loop?: boolean,
    n?: number,
    size?: Vector,
    scalar?: number
}

export type Sprite = ImgSprite | AniSprite;

export class ImgSprite {
    image: HTMLImageElement;
    scale?: Vector;

    constructor (filePath: string, scalar=new Vector()) {
        // FIXME: Check if file exists
        
        const image = new Image();
        image.src = filePath;
        image.onload = () => this.image = image;

        this.scale = scalar;
    }

    show(x: number, y: number){
        let image = this.image
        if (!image) return;

        ctx.drawImage(image, x, y, image.width * this.scale.x, image.height * this.scale.y);

        return;
    }
}

export class AniSprite{
    spriteSheet: string;
    images: HTMLImageElement[];
    currentImage: number;
    maxImage: number;
    frameRate: number;
    scalar: number;

    constructor(spriteSheet: string, numImages: number, frameRate?: number, scalar?: number) {
        this.spriteSheet = spriteSheet;
        this.images = [];
        this.currentImage = 0;
        this.maxImage = numImages;
        this.frameRate = frameRate;

        this.scalar = scalar || 1

        for (let i = 1; i <= numImages; i++) {
            var image = new Image()

            image.src = `${spriteSheet}${i}.png`
            this.images[i - 1] = image;
        }
    }

    

    show(x: number, y: number, frameRate: number, options: AniSpriteOptions={}) {
        let {
            loop: loop,
            n: n,
            size: size,
            scalar: scalar
        } = options

        if (!n) loop = true;

        // Still images (1 frame)
        if (this.maxImage == 1) {
            let image = this.images[0];
            if (size) {
                ctx.drawImage(image, x + size.x - image.width * (scalar || this.scalar), y + size.y - image.height * this.scalar, image.width * (scalar || this.scalar), image.height * (scalar || this.scalar));
            } else {
                ctx.drawImage(image, x, y, image.width * (scalar || this.scalar), image.height * (scalar || this.scalar));
            }
            return;
        }

        // Continue looping (animation)
        if (loop) {
            if (this.currentImage >= this.maxImage) {
                this.currentImage = 0;
            }
            let image = this.images[Math.floor(this.currentImage)];
            if (size) {
                ctx.drawImage(image, x + size.x - image.width * this.scalar, y + size.y - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
            } else {
                ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
            }
            this.currentImage += (this.frameRate || frameRate) / (30);
        }

        // Show nth frame of animation
        else {
            if (n !== null && n >= 0 && n < this.maxImage) {
                let image = this.images[n];
                if (size) {
                    ctx.drawImage(image, x + size.x - image.width * this.scalar, y + size.y - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
                } else {
                    ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
                }
            }
        }
    }
}
