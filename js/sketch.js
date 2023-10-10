const server = localStorage.getItem("server");

const frameRate = 60;
const frameDelay = 1000 / frameRate;
let lastFrameTime = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var player = new Image();
player.src = "/assets/sprite_sheet.png";
var x = 0;
var p = new Player(50, 310, 13 * 2, 18 * 2, "red", localStorage.getItem("username"));
var otherClients = [];
var AIs = [];
var mapBlockCollision = [];
var backgroundColor = "black"
var mapRef = new Image()
var fire;
var hand;
var handPos;
mapRef.src = "/assets/sprite_sheet/map/map.png"
// On focus on canvas, hide cursor
canvas.addEventListener("click", function (e) {
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

var socket;

// 10.223.16.17
if (server != null && server != undefined && server != "") {
    console.log(server)
    socket = new WebSocket(`ws://${server}`);

    socket.onopen = (event) => {
        // Connection opened, you can send data now
        socket.send(JSON.stringify({
            action: "join",
            user: p.name
        }))
    
        requestAnimationFrame(draw);
    };
    
    socket.onclose = (event) => {
        // socket.send(JSON.stringify({
        //     action: "remove",
        //     user: p.name
        // }))
        // Connection closed, handle this event if needed
    };

    socket.onmessage = (event) => {
        // Handle incoming messages from the server
        const data = JSON.parse(event.data);
    
        // Skip if the message is from the current user
        if (data.user != p.name) {
            // console.log(data)
            if (data.action == "join") { 
                console.log(`Recieved new player ${data.user}`)   
                otherClients.push(new Player(50, 310, 13 * 2, 18 * 2, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`, data.user));
            } else if (data.action == "update") {
                for (let client of otherClients) {
                    if (client.name == data.user) {
                        client.position.x = data.position.x;
                        client.position.y = data.position.y;
                        
                        client.velocity.x = data.velocity.x;
                        client.velocity.y = data.velocity.y;
                    }
                }
            }else if (data.action == "remove") {
                console.log(data)
                let index = -1;

                for (let i=0; i<otherClients.length; i++) {
                    if (otherClients[i].name == data.user) {
                        index = i;
                    }
                } 

                console.log(index)
                if(index !== -1) {
                    otherClients.splice(index, 1)
                }
            }
        }
    };
    
}

// Blocks for top and bottom of screen
// var topScreen = new Block(0, 0, canvas.width, 1);
// var bottomScreen = new Block(0, canvas.height - 1, canvas.width, 1);

var frameCount = 0;

let lastSent;

function draw() {
    let currentTime = performance.now();

    // Calculate the time elapsed since the last frame
    const elapsed = currentTime - lastFrameTime;

    // Only draw if enough time has passed
    if (elapsed < frameDelay) return requestAnimationFrame(draw);

    const message = {
        action: "update",
        user: p.name,
        content: {
            position: {
                x: p.position.x,
                y: p.position.y
            },
            velocity: {
                x: p.velocity.x,
                y: p.velocity.y
            }
        },
    };

    // Only send if the message has changed
    if (socket) {
        if (JSON.stringify(message) !== JSON.stringify(lastSent)) {
            socket.send(JSON.stringify(message));
            lastSent = message;
        }
    }

    if (!lastSent) {
        lastSent = message;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    mapBlockCollision.forEach(mObject => {
        mObject.show()
    });

    //Joust Map Example
    ctx.drawImage(mapRef, 0, 0, canvas.width, canvas.height)

    if (fire) {
        fire.show(2, 28, 388 - fire.images[0].height * fire.scalar)
        fire.show(2, canvas.width - 28, 388 - fire.images[0].height * fire.scalar)
    }
    p.show()
    p.update();

    for (let client of otherClients) {
        client.show();
        client.update();

        // mapBlockCollision.forEach(mObject => {
        //     handleCollision(client, mObject)
        // });
    
    }

    // if (hand.currentImage < 4.8) {
    //     handPos = Vector.lerp(new Vector(28, 388), p.position.clone().add(p.height), hand.currentImage / hand.images.length);
    //     hand.show(1, handPos.x - 30, handPos.y-10)
    //     p.update()
    // } else {
    //     setTimeout(() => hand.currentImage = 0, 1000);
    //     handPos = Vector.lerp(new Vector(28, 388), p.position.clone().add(p.height), 1);
    //     hand.show(0, handPos.x - 30, handPos.y-10)
    // }

    for (let i = AIs.length - 1; i >= 0; i--) {
        AIs[i].show();
        AIs[i].update();
        if (isColliding(p, AIs[i])) {
            if (p.position.y + p.height - (p.currentAnimation.images[0].height * p.currentAnimation.scalar) < AIs[i].position.y + AIs[i].height - (AIs[i].currentAnimation.images[0].height * AIs[i].currentAnimation.scalar)) {
                AIs.splice(i, 1);
                continue;
            } else {
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
    for (let i = 0; i < AIs.length; i++) {
        mapBlockCollision.forEach(mObject => {
            handleCollision(AIs[i], mObject)
        });
    }
    mapBlockCollision.forEach(mObject => {
        handleCollision(p, mObject)
    });



    frameCount++;
    requestAnimationFrame(draw);
}

player.onload = function () {
    hand = new Sprite("/assets/sprite_sheet/lava_troll/troll", 5, null, 2);
    fire = new Sprite("/assets/sprite_sheet/lava_troll/fire", 4, null, 2);
    for (let i = 0; i < 5; i++) {
        AIs[i] = new Enemy(Math.random() * canvas.width, 20, 13 * 2, 19 * 2, "green");
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
};

if (!socket) {
    requestAnimationFrame(draw);
}