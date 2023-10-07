
function Sprite(spriteSheet, numImages, frameRate, scalar) {

    if(numImages == undefined){
        numImages = 1
    }
    if(frameRate == undefined){
        frameRate == null
    }
    if(scalar == undefined){
        scalar == null
    }

    this.spriteSheet = spriteSheet
    this.images = []
    this.currentImage = 0
    this.maxImage = numImages
    this.frameRate = frameRate

    this.scalar = scalar || 1

    for (var i = 1; i <= numImages; i++) {
        var image = new Image()

        //image.src = `${spriteSheet}${i}.png`
        image.src = spriteSheet + i + ".png"
        this.images[i - 1] = image;

        //console.log(`${spriteSheet}${i}.png`)
    }
}

Sprite.prototype.show = function (frameRate, x, y, options) {

    if(options == undefined){
        options = {}
    }
    // scale
    // loop
    // n
    // bird

    // let {
    //     loop: loop,
    //     n: n,
    //     size: size
    // } = options;

    loop = options.loop
    n = options.n
    size = options.size

    console.log(options)

    if (!n) loop = true;

    // Still images (1 frame)
    if (this.maxImage == 1) {
        var image = this.images[0];
        if (size) {
            ctx.drawImage(image, x + size.x - image.width * this.scalar, y + size.y - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
        } else {
            ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
        }
        return;
    }

    // Continue looping (animation)
    if (loop) {
        var image = this.images[Math.floor(this.currentImage)];
        if (size) {
            ctx.drawImage(image, x + size.x - image.width * this.scalar, y + size.y - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
        } else {
            ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
        }
        this.currentImage += (this.frameRate || frameRate) / (30);
        if (this.currentImage >= this.maxImage) {
            this.currentImage = 0;
        }
    }

    // Show nth frame of animation
    else {
        if (n !== null && n >= 0 && n < this.maxImage) {
            var image = this.images[n];
            if (bird) {
                ctx.drawImage(image, x + bird.width - image.width * this.scalar, y + bird.height - image.height * this.scalar, image.width * this.scalar, image.height * this.scalar);
            } else {
                ctx.drawImage(image, x, y, image.width * this.scalar, image.height * this.scalar);
            }
        }
    }
}