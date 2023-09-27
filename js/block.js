class Block {
    constructor(x, y, w, h) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.width = w;
        this.height = h;
    }

    show () {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}