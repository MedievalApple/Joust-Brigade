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

var frameCount = 0;
var block1 = new Block(400, 200, 200, 50);
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, canvas.width / 2 - logo.width / 2, logo.height / 2)

    sprite1.show(12)
    p.show()
    block1.show()
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
    ai() {}
}
