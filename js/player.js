class Player {
    constructor(x, y, width, height, color) {
        this.currentAnimation = null; 
        this.animations = {
            running: new Sprite("/assets/Sprite Sheet/Ostrich/Walk (Ostrich)/Walk", 4, null, 2),
            stop: new Sprite("/assets/Sprite Sheet/Ostrich/Walk (Ostrich)/stop", 1, 60, 2),
            flap: new Sprite("/assets/Sprite Sheet/Ostrich/Flap (Ostrich)/Flap", 2, null, 2),
            idle: new Sprite("/assets/Sprite Sheet/Ostrich/Idle (Ostrich)/Idle_Standing", 1, null, 2)

        }

        this.velocity = new Vector(0, 0);
        this.position = new Vector(x, y);
        this.width = width;
        this.height = height;
        this.gravity = 0.05;
        this.friction = 0.4;
        this.xAccel = 0;
        this.blockInfo = { x: -100, y: -100, w: -100 };
        this.MAX_SPEED = 5;
        this.color = color;
        this.jumpDirection = false;
        this.isJumping = false;
    }

    show() {
        ctx.fillStyle = this.color;

        if (this.isJumping) { 
            this.currentAnimation = this.animations.flap;
        } else if (this.velocity.x == 0) {
            this.currentAnimation = this.animations.idle;
        } else if (Math.sign(this.velocity.x) != Math.sign(this.xAccel)) {
            this.currentAnimation = this.animations.stop;
        } else {
            this.currentAnimation = this.animations.running;
        }
        if (this.currentAnimation!=this.animations.flap) {
            this.jumpDirection = false;
        }
        if (!this.currentAnimation) return;    
        if ((this.velocity.x < 0&&!this.isJumping)||this.jumpDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            this.currentAnimation.show(Math.abs(this.velocity.x*2), -this.position.x - this.width, this.position.y, {
                size : new Vector(this.width, this.height),
                scalar: 2
            });
            ctx.restore();
        } else {
            this.currentAnimation.show(Math.abs(this.velocity.x*2), this.position.x, this.position.y, {
                size : new Vector(this.width, this.height),
                scalar: 2
            });
        }
    }

    // Torroidal collision detection
    handleCollisions() {
        if (!(this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) this.blockInfo = { x: -100, y: -100, w: -100 };
        if (this.position.y + this.height > canvas.height || (this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w && this.position.y + this.height > this.blockInfo.y)) {
            if ((this.blockInfo.x < this.position.x && this.position.x < this.blockInfo.x + this.blockInfo.w)) {
                this.isJumping = false;
                this.position.y = this.blockInfo.y - this.height;
                this.velocity.y *= -this.friction;
                this.blockInfo = { x: -100, y: -100, w: -100 };
            } else {
                this.isJumping = true;
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
        this.velocity.x += this.xAccel;
        if (Math.abs(this.velocity.x) > this.MAX_SPEED) {
            this.velocity.x = this.MAX_SPEED * Math.sign(this.velocity.x)
        } else if (Math.sign(this.velocity.x) == Math.sign(this.xAccel) && Math.abs(this.velocity.x) < 0.5) {
            // draw sprite in direction player was going
            this.show();

            this.velocity.x = 0;
            this.xAccel = 0;
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
            running: new Sprite("/assets/Sprite Sheet/Bounder/Walk (Bounder)/Walk", 4, null, 2),
            flap: new Sprite("/assets/Sprite Sheet/Bounder/Flap (Bounder)/Flap", 2, null, 2),
            // idle: new Sprite("/assets/Sprite Sheet/Bounder/Idle (Bounder)/Idle_Standing", 1)
        }
    }
}