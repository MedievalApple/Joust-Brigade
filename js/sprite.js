class Sprite {
    constructor(spriteSheet, numImages = 1, frameRate = null, scalar = null) {
        this.spriteSheet = spriteSheet;
        this.images = [];
        this.currentImage = 0;
        this.maxImage = numImages;
        this.frameRate = frameRate;
        
        this.scalar = scalar || 1

        // if (numImages == 1) {
        //     var image = new Image()

        //     image.src = spriteSheet;
        //     this.images.push(image);
        // } else {
            for (let i = 1; i <= numImages; i++) {
                var image = new Image()

                image.src = `${spriteSheet}${i}.png`
                this.images[i - 1] = image;

                console.log(`${spriteSheet}${i}.png`)
            }
        // }
    }

    show(frameRate, x, y, options = {}) {
        // scale
        // loop
        // n
        // bird

        let {
            loop: loop,
            n: n,
            size: size
        } = options;

        if (!n) loop = true;

        // Still images (1 frame)
        if (this.maxImage == 1) {
            let image = this.images[0];
            if (size) {
                ctx.drawImage(image, x + size.x - image.width * this.scalar, y + size.y - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
            } else {
                ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
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
                if (bird) {
                    ctx.drawImage(image, x + bird.width - image.width * this.scalar, y + bird.height - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
                } else {
                    ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
                }
            }
        }
    }
}