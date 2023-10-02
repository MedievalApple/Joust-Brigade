class Block {
    constructor(x, y, w, h, c) {
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.width = w;
        this.height = h;
        this.color = c;

        mapObjects.push(this);
    }

    show () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}