class Player {
    constructor(x, y, width, height) {
        this.velocity = new Vector(0, 0);
        this.position = new Vector(x, y);
        this.width = width;
        this.height = height;
        this.gravity = 0.05;
        this.friction = 0.4;
        this.velAcc = 0;
        this.blockInfo = {x:-100, y:-100, w:-100};
        this.MAX_SPEED = 5;
    }

    show() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    // Torroidal collision detection
    handleCollisions() {
        if(!(this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) this.blockInfo = {x:-100, y:-100, w:-100};
        if (this.position.y + this.height > canvas.height || (this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w&&this.position.y+this.height>this.blockInfo.y)) {
            if ((this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) { 
                this.position.y = this.blockInfo.y - this.height;
                this.velocity.y *= -this.friction;
                this.blockInfo = {x:-100, y:-100, w:-100};
            } else {
                this.position.y = canvas.height - this.height;
                this.velocity.y *= -this.friction;
            }
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.y *= -this.friction;
        }

        if (this.position.x > canvas.width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = canvas.width;
        }
    }

    update() {
        this.velocity.y += this.gravity;
        this.velocity.x += this.velAcc;
        if(Math.abs(this.velocity.x)>this.MAX_SPEED) {
            this.velocity.x = this.MAX_SPEED * Math.sign(this.velocity.x)
        }else if(Math.sign(this.velocity.x)==Math.sign(this.velAcc)&&Math.abs(this.velocity.x)<0.5) {
            this.velocity.x = 0;
            this.velAcc = 0;
        }
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.handleCollisions();
    }
}
