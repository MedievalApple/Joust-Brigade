
    function Player(x, y, width, height, color) {
        this.currentAnimation = null;
        this.animations = {
            running: new Sprite("/assets/sprite_sheet/ostrich/walk_ostrich/walk", 4, null, 2),
            stop: new Sprite("/assets/sprite_sheet/ostrich/walk_ostrich/stop", 1, 60, 2),
            flap: new Sprite("/assets/sprite_sheet/ostrich/flap_ostrich/flap", 2, null, 2),
            idle: new Sprite("/assets/sprite_sheet/ostrich/idle_ostrich/idle_standing", 1, null, 2)

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

    Player.prototype.show = function() {
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
        if (this.currentAnimation != this.animations.flap) {
            this.jumpDirection = false;
        }
        if (!this.currentAnimation) return;
        this.width = this.currentAnimation.images[0].width * this.currentAnimation.scalar;
        this.height = this.currentAnimation.images[0].width * this.currentAnimation.scalar;
        if ((this.velocity.x < 0 && !this.isJumping) || this.jumpDirection) {
            ctx.save();
            ctx.scale(-1, 1);
            this.currentAnimation.show(Math.abs(this.velocity.x * 2), -this.position.x - this.width, this.position.y, {
                size: new Vector(this.width, this.height),
                scalar: 2
            });
            ctx.restore();
        } else {
            this.currentAnimation.show(Math.abs(this.velocity.x * 2), this.position.x, this.position.y, {
                size: new Vector(this.width, this.height),
                scalar: 2
            });
        }
    }

    // Torroidal collision detection
    Player.prototype.handleCollisions = function() {
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

    Player.prototype.update = function() {
        if (!Math.sign) Math.sign = function(x) { return ((x > 0) - (x < 0)) || +x; };
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

var __extends = function(enemy, player){
    function fn(){
        this.constructor = enemy
    }
    fn.prototype = player.prototype
    enemy.prototype = new fn()
}


    var Enemy = (function(Player){
        __extends(Enemy, Player)
        function Enemy(x, y, width, height, color){
            Player.call(this)
            this.animations = {
                running: new Sprite("/assets/sprite_sheet/bounder/walk_bounder/walk", 4, null, 2),
                flap: new Sprite("/assets/sprite_sheet/bounder/flap_bounder/flap", 2, null, 2),
                // idle: new Sprite("/assets/Sprite Sheet/Bounder/Idle (Bounder)/Idle_Standing", 1)
            }
        }
        return Enemy;
    })(Player)