class Sprite {
    constructor(spriteSheet, numRows, numCols) {
        this.spriteSheet = spriteSheet;
        this.images = [];
        this.currentImage = 0;
        this.maxImage = numCols * numRows;
        var imageWidth = spriteSheet.width / numCols;
        var imageHeight = spriteSheet.height / numRows;
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                var tempCanvas = document.createElement("canvas");
                var tempCtx = tempCanvas.getContext("2d");
                tempCanvas.width = imageWidth;
                tempCanvas.height = imageHeight;
                tempCtx.drawImage(
                    spriteSheet,
                    col * imageWidth,
                    row * imageHeight,
                    imageWidth,
                    imageHeight,
                    0,
                    0,
                    imageWidth,
                    imageHeight
                );
                var tempImage = new Image();
                tempImage.src = tempCanvas.toDataURL('image/png');
                this.images.push(tempImage);
            }
        }
    }

    show(frameRate) {
        ctx.drawImage(this.images[Math.floor(this.currentImage)], 0, 0, canvas.width, canvas.height);
        this.currentImage += frameRate / (30);
        if (this.currentImage >= this.maxImage) {
            this.currentImage = 0;
        }

    }
}