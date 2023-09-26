class Block {
    constructor(x, y, w, h) {
        this.x = x, this.y = y;
        this.w = w, this.h = h;
    }
    show () {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}