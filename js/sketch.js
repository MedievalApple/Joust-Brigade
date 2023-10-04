var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var player = new Image();
player.src = "/assets/sprite_sheet.png";
var sprite1;
var p
var x = 0;
var p = new Player(50, 310, 13*2, 18*2, "red");
var AIs = [];
var mapObjects = [];
var backgroundColor = "black"
var mapRef = new Image()
mapRef.src = "/assets/Sprite Sheet/Map/Map.png"

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

    //Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    sprite1.show(5)

    mapObjects.forEach(mObject => {
        mObject.show()
    });

    //Joust Map Example
    ctx.drawImage(mapRef, 0, 0, canvas.width,canvas.height)

    p.update()
    p.show()

    for (let i = 0; i < AIs.length; i++) {
        AIs[i].show();
        AIs[i].update();
        if (Math.random() < 0.1) {
            if (AIs[i].position.y > p.position.y) {
                AIs[i].isJumping = true;
                AIs[i].velocity.y -= 3;
                if (AIs[i].velocity.y < -3) {
                    AIs[i].velocity.y = -3;
                }
            } else {
                if (Math.random() < 0.1) {
                    AIs[i].isJumping = true;
                    AIs[i].velocity.y -= 3;
                    if (AIs[i].velocity.y < -3) {
                        AIs[i].velocity.y = -3;
                    }
                }
            }
        }
        switch (AIs[i].velocity.x > 0) {
            case true:
                AIs[i].jumpDirection = false;
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = 1;
                    AIs[i].xAccel = 0.05;
                } else {
                    AIs[i].xAccel = 0.07;
                }
                break;
            case false:
                AIs[i].jumpDirection = true;
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = -1;
                    AIs[i].xAccel = -0.05;
                } else {
                    AIs[i].xAccel = -0.07;
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
    }
    mapObjects.forEach(mObject => {
        handleCollision(p, mObject)
    });

    frameCount++;
    requestAnimationFrame(draw);
}

player.onload = function () {
    for (let i = 0; i < 5; i++) {
        AIs[i] = new Enemy(50, 310, 13*2, 19*2, "green");
        switch (Math.floor(Math.random() * 2)) {
            case 0:
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = 1;
                    AIs[i].xAccel = 0.05;
                } else {
                    AIs[i].xAccel = 0.07;
                }
                break;
            case 1:
                this.jumpDirection = true;
                if (Math.abs(AIs[i].velocity.x) == 0) {
                    AIs[i].velocity.x = -1;
                    AIs[i].xAccel = -0.05;
                } else {
                    AIs[i].xAccel = -0.07;
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
