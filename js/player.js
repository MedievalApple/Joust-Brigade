class Player {
    constructor(x, y, width, height, color) {
        this.currentAnimation = null; 
        this.animations = {
            running: new Sprite("/assets/Sprite Sheet/Ostrich/Walk (Ostrich)/Walk", 4),
            flap: new Sprite("/assets/Sprite Sheet/Ostrich/Flap (Ostrich)/Flap", 2, 60),
            idle: new Sprite("/assets/Sprite Sheet/Ostrich/Idle (Ostrich)/Idle_Standing", 1)
        }

        this.velocity = new Vector(0, 0);
        this.position = new Vector(x, y);
        this.width = width;
        this.height = height;
        this.gravity = 0.05;
        this.friction = 0.4;
        this.velAcc = 0;
        this.blockInfo = { x: -100, y: -100, w: -100 };
        this.MAX_SPEED = 5;
        this.color = color;
    }

    show() {
        ctx.fillStyle = this.color;
        let flip = false;

        if (Math.abs(this.velocity.y) > 0.25) { 
            this.currentAnimation = this.animations.flap;
        } else if (this.velocity.x == 0) {
            this.currentAnimation = this.animations.idle;
        } else if (this.velocity.x < 0) {
            flip = true;
            this.currentAnimation = this.animations.running;
        } else {
            this.currentAnimation = this.animations.running;
        }

        if (flip) {
            ctx.save();
            ctx.scale(-1, 1);
            this.currentAnimation.show(5, -this.position.x - this.width, this.position.y, this.width, this.height);
            ctx.restore();
        } else {
            this.currentAnimation.show(5, this.position.x, this.position.y, this.width, this.height);
        }
    }

    // Torroidal collision detection
    handleCollisions() {
        if (!(this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) this.blockInfo = { x: -100, y: -100, w: -100 };
        if (this.position.y + this.height > canvas.height || (this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w && this.position.y + this.height > this.blockInfo.y)) {
            if ((this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) {
                this.position.y = this.blockInfo.y - this.height;
                this.velocity.y *= -this.friction;
                this.blockInfo = { x: -100, y: -100, w: -100 };
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
        if (Math.abs(this.velocity.x) > this.MAX_SPEED) {
            this.velocity.x = this.MAX_SPEED * Math.sign(this.velocity.x)
        } else if (Math.sign(this.velocity.x) == Math.sign(this.velAcc) && Math.abs(this.velocity.x) < 0.5) {
            // draw sprite in direction player was going
            this.show();

            this.velocity.x = 0;
            this.velAcc = 0;
        }

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        this.handleCollisions();
    }
}

class Enemy extends Player {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);

        this.animations = {
            running: new Sprite("/assets/Sprite Sheet/Bounder/Walk (Bounder)/Walk", 4),
            flap: new Sprite("/assets/Sprite Sheet/Bounder/Flap (Bounder)/Flap", 2),
            // idle: new Sprite("/assets/Sprite Sheet/Bounder/Idle (Bounder)/Idle_Standing", 1)
        }
    }
}