var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");
var player = new Image();
player.src = "/assets/sprite_sheet.png";
var sprite1;
var p
var x = 0;
var p = new Player(0, 0, 30, 50);
var logo = new Image()
logo.src = "/assets/logo.png"

// On focus on canvas, hide cursor
canvas.addEventListener("click", function () {
    canvas.requestPointerLock();
});

// On escape, show cursor
document.addEventListener("keydown", function (e) {
    if (e.code == 27) {
        document.exitPointerLock();
    }
});

// Blocks for top and bottom of screen
var topScreen = new Block(0, 0, canvas.width, 1);
var bottomScreen = new Block(0, canvas.height - 1, canvas.width, 1);

var frameCount = 0;
var block1 = new Block(400, 200, 200, 50);
var block2 = new Block(200, 400, 200, 50);
var block3 = new Block(800, 300, 200, 50);
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, canvas.width / 2 - logo.width / 2, logo.height / 2)

    sprite1.show(1)
    block1.show()
    block2.show()
    block3.show()

    p.update()
    p.show()

    handleCollision(p, block1)
    handleCollision(p, block2)
    handleCollision(p, block3)
    // handleCollision(p, topScreen)
    // handleCollision(p, bottomScreen)

    frameCount++;
    requestAnimationFrame(draw);
}

player.onload = function () {
    sprite1 = new Sprite(player, 2, 2)
    requestAnimationFrame(draw);
};

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite;
    }
}

class Enemy extends Entity {
    ai() { }
}
