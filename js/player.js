class Player {
    constructor(x, y, width, height) {
        this.velX = 0;
        this.velY = 0;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    show() {
        this.y+=this.velY;
        this.x += this.velX;
        this.velY +=0.09
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.y+this.height>canvas.height) {
            this.y = canvas.height - this.height;
            this.velY = 0;
        }
    }
}
