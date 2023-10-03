class Sprite {
    constructor(spriteSheet, numImages, frameRate=null) {
        this.spriteSheet = spriteSheet;
        this.images = [];
        this.currentImage = 0;
        this.maxImage = numImages;
        this.frameRate = frameRate;


        for (let i = 1; i <= numImages; i++) {
            var image = new Image()

            image.src = `${spriteSheet}${i}.png`
            this.images[i - 1] = image;

            console.log(`${spriteSheet}${i}.png`)
        }
    }

    show(frameRate, x, y, w, h, loop = true, n = null) {
        if (this.maxImage == 1) {
            ctx.drawImage(this.images[0], x, y, w, h);
            return;
        }

        if (loop) {
            ctx.drawImage(this.images[Math.floor(this.currentImage)], x, y, w, h);

            this.currentImage += (this.frameRate || frameRate) / (30);
            if (this.currentImage >= this.maxImage) {
                this.currentImage = 0;
            }
        } else {
            if (n !== null && n >= 0 && n < this.maxImage) {
                ctx.drawImage(this.images[n], x, y, w, h);
            }
        }
    }
}