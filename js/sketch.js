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
var mapBlockCollision = [];
var backgroundColor = "black"
var mapRef = new Image()
mapRef.src = "/assets/sprite_sheet/map/map.png"

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

    for (var i = 0; i < mapBlockCollision.length; i++) {
        mapBlockCollision[i].show()
    }

    //Joust Map Example
    ctx.drawImage(mapRef, 0, 0, canvas.width,canvas.height)

    p.update()
    p.show()

    for (var i = AIs.length - 1; i >= 0; i--) {
        AIs[i].show();
        AIs[i].update();
        if(isColliding(p, AIs[i])) {
            if(p.position.y + p.height - (p.currentAnimation.images[0].height*p.currentAnimation.scalar) < AIs[i].position.y + AIs[i].height - (AIs[i].currentAnimation.images[0].height*AIs[i].currentAnimation.scalar)) {
                AIs.splice(i, 1);
                continue;
            }else {
                console.log("You Died")
            }
        }
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
    for (var i = 0; i < AIs.length; i++) {
        for (var o = 0; o < mapBlockCollision.length; o++) {
            handleCollision(AIs[i], mapBlockCollision[o])
        }
    }
    for (var o = 0; o < mapBlockCollision.length; o++) {
        handleCollision(p, mapBlockCollision[o])
    }
    

    frameCount++;
    // if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)){
    //     requestAnimationFrame(draw);
    // }else{
    //     webkitRequestAnimationFrame(draw);
    // }
}

player.onload = function () {
    for (var i = 0; i < 5; i++) {
        AIs[i] = new Enemy(Math.random() * canvas.width, 20, 13*2, 19*2, "green");
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

    // if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)){
    //     requestAnimationFrame(draw);
    // }else{
    //     webkitRequestAnimationFrame(draw);
    // }
    draw()
    setInterval(draw, 16.7)
};


    function Entity(x, y) {
        this.x = x;
        this.y = y;
        this.sprite;
    }
