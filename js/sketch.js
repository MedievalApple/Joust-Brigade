var canvas = document.getElementById("canvas");
// var canvasContainer = document.getElementById("canvas-container");

// set canvas width and height to both be that of the smaller of the two window dimensions
const size = Math.min(window.innerWidth, window.innerHeight);

// canvasContainer.width = size;
// canvasContainer.height = size;

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var player = new Image();
player.src = "/assets/sprite_sheet.png";
var sprite1;
var p
var x = 0;
var p = new Player(0, 0, 13*4, 19*4, "red");
var AIs = [];
var mapObjects = [];
var logo = new Image()
logo.src = "/assets/logo.png"

// On focus on canvas, hide cursor
canvas.addEventListener("click", function () {
    //canvas.requestPointerLock();
    //Fullscreen Mode
    //canvas.requestFullscreen();
});

// On escape, show cursor
document.addEventListener("keydown", function (e) {
    if (e.code == 27) {
        document.exitPointerLock();
        //Exit Fullscreen Mode
        //document.exitFullscreen();
    }
});

// Blocks for top and bottom of screen
// var topScreen = new Block(0, 0, canvas.width, 1);
// var bottomScreen = new Block(0, canvas.height - 1, canvas.width, 1);

var frameCount = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(logo, canvas.width / 2 - logo.width / 2, logo.height / 2)

    sprite1.show(5)

    mapObjects.forEach(mObject => {
        mObject.show()
    });
    //block1.show()
    // block2.show()
    // block3.show()

    p.update()
    p.show()

    for (let i = 0; i < AIs.length; i++) {
        AIs[i].show();
        AIs[i].update();
        if (Math.random() < 0.1) {
            if (AIs[i].position.y > p.position.y) {
                AIs[i].velocity.y -= 3;
                if (AIs[i].velocity.y < -3) {
                    AIs[i].velocity.y = -3;
                }
            } else {
                if (Math.random() < 0.1) {
                    AIs[i].velocity.y -= 3;
                    if (AIs[i].velocity.y < -3) {
                        AIs[i].velocity.y = -3;
                    }
                }
            }
        }
        switch (AIs[i].velocity.x > 0) {
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
        mapObjects.forEach(mObject => {
            handleCollision(AIs[i], mObject)
        });
        // handleCollision(AIs[i], block1)
        // handleCollision(AIs[i], block2)
        // handleCollision(AIs[i], block3)
    }
    mapObjects.forEach(mObject => {
        handleCollision(p, mObject)
    });
    //handleCollision(p, block1)
    // handleCollision(p, block2)
    // handleCollision(p, block3)
    // handleCollision(p, topScreen)
    // handleCollision(p, bottomScreen)

    frameCount++;
    requestAnimationFrame(draw);
}

player.onload = function () {
    for (let i = 0; i < 5; i++) {
        AIs[i] = new Player(i * canvas.width / 5, 0, 30, 50, "green");
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
    sprite1 = new Sprite("/assets/Sprite Sheet/Bounder/Walk (Bounder)/Walk", 4)
    requestAnimationFrame(draw);
};

class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sprite;
    }
}
