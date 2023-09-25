var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = new Image();
player.src = "assets/ostrich.png";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var x = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(player, 0, 0, canvas.width, canvas.height);
    x++;
    requestAnimationFrame(draw);
}
player.onload = function () {
    requestAnimationFrame(draw);
};


class Entity {
    sprite 

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Player {

}

class Enemy extends Entity {

    ai() {

    }
}