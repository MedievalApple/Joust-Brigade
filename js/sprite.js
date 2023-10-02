class Sprite {
    constructor(spriteSheet, numImages) {
        this.spriteSheet = spriteSheet;
        this.images = [];
        this.currentImage = 0;
        this.maxImage = numImages;
        for(let i = 1; i <= numImages; i++) {
            var image = new Image()
            
            image.src = `${spriteSheet}${i}.png`
            this.images[i-1] = image;
        }
    }

    show(frameRate, x, y, w, h) {
        ctx.drawImage(this.images[Math.floor(this.currentImage)], x, y, w, h);
        this.currentImage += frameRate / (30);
        if (this.currentImage >= this.maxImage) {
            this.currentImage = 0;
        }

    }
}