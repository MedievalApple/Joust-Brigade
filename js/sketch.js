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
var AIs = [];
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
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, canvas.width / 2 - logo.width / 2, logo.height / 2)

    sprite1.show(5)
    block1.show()
    // block2.show()
    // block3.show()

    p.update()
    p.show()

    for (let i = 0; i < AIs.length; i++) {
        AIs[i].show();
        AIs[i].update();
        if (AIs[i].position.y > p.position.y) {
            AIs[i].velocity.y -= 3;
            if (AIs[i].velocity.y < -3) {
                AIs[i].velocity.y = -3;
            }
        }
        switch (AIs[i].velocity.x>0) {
            case true:
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = 1;
                    AIs[i].velAcc = 0.05;
                } else {
                    AIs[i].velAcc = 0.07;
                }
                break;
            case false:
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = -1;
                    AIs[i].velAcc = -0.05;
                } else {
                    AIs[i].velAcc = -0.07;
                }
                break;
            default:
                break;
        }
    }
    for (let i = 0; i < AIs.length; i++) {
        handleCollision(AIs[i], block1)
        // handleCollision(AIs[i], block2)
        // handleCollision(AIs[i], block3)
    }
    handleCollision(p, block1)
    // handleCollision(p, block2)
    // handleCollision(p, block3)
    // handleCollision(p, topScreen)
    // handleCollision(p, bottomScreen)

    frameCount++;
    requestAnimationFrame(draw);
}

player.onload = function () {
    for (let i = 0; i < 5; i++) {
        AIs[i] = new Player(i * canvas.width / 5, 0, 30, 50);
        switch (Math.floor(Math.random() * 2)) {
            case 0:
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = 1;
                    AIs[i].velAcc = 0.05;
                } else {
                    AIs[i].velAcc = 0.07;
                }
                break;
            case 1:
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = -1;
                    AIs[i].velAcc = -0.05;
                } else {
                    AIs[i].velAcc = -0.07;
                }
                break;
            default:
                break;
        }
    }
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
