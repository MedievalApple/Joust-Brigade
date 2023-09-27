class Player {
    constructor(x, y, width, height) {
        this.velocity = new Vector(0, 0);
        this.position = new Vector(x, y);
        this.width = width;
        this.height = height;
        this.gravity = 0.05;
        this.friction = 0.4;
        this.onBlock = false;
    }

    show() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Torroidal collision detection
    handleCollisions() {
        if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity.y *= -this.friction;
        } else if (this.position.y < 0||this.onBlock) {
            this.position.y = 0;
            this.velocity.y *= -this.friction;
            console.log(this.onBlock)
            if(this.onBlock) this.onBlock = false;
        }
    
        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    }    

    update() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.handleCollisions();
    }
}
