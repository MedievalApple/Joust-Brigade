// import '../css/joust.css';
import { Player, Enemy, DeathAnimation } from './player';
import { AniSprite } from './sprite';
import { handleCollision } from './collision';
import { WebSocket } from 'ws';
import { InputHandler } from './controls';

// Constants for readability
export const FRAME_RATE = 60;
let lastFrameTime = 0;
let lastUpdateTime = 0;

const SERVER_ADDRESS = localStorage.getItem("server");
const PLAYER_WIDTH = 13 * 2;
const PLAYER_HEIGHT = 18 * 2;
const PLAYER_COLOR = "red";
const LOCAL_USERNAME = localStorage.getItem("username");

// Canvas and context initialization
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Player image loading
const playerImage = new Image();
playerImage.src = "/assets/sprite_sheet.png";

// Arrays for other clients, AIs, and map blocks
const GAME_OBJECTS = [];
const otherClients = [];

// Background color
const backgroundColor = "black";

// Map reference image loading
const mapRef = new Image();
mapRef.src = "/assets/sprite_sheet/map/map.png";

// Variables for fire and hand
let fire;
let hand;

// Hand position
let handPos;

// WebSocket connection
let socket;

// Frame count and lastSent data
let frameCount = 0;
let lastSent;

const deaths = [];
// Player creation
const player = new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, LOCAL_USERNAME);

for (let i = 0; i < 5; i++) {
    new Enemy(Math.random() * canvas.width, 20, PLAYER_WIDTH, PLAYER_HEIGHT, "green");
}
// REMEMBER TO FIX DIFFERENCE BETWEEN UPPERCASE/LOWERCASE
new InputHandler({
    "a": {
        keydown: player.handleLeft.bind(player)
    },
    "d": {
        keydown: player.handleRight.bind(player)
    },
    "w": {
        keydown: player.handleJump.bind(player)
    },
})

// Load player image before starting the game
playerImage.onload = function () {
    hand = new AniSprite("/assets/sprite_sheet/lava_troll/troll", 5, null, 2);
    fire = new AniSprite("/assets/sprite_sheet/lava_troll/fire", 4, null, 2);

};

// Function to perform the authentication handshake
async function performAuthentication() {
    // Check if the user is authenticated, and if not, prompt for authentication credentials
    if (!localStorage.getItem("authToken")) {
        // Send a registration request to the server to obtain an authentication token
        socket.send(JSON.stringify({
            action: "register",
            LOCAL_USERNAME
        }));
    }
}

let interval;

// WebSocket initialization
if (SERVER_ADDRESS) {
    socket = new WebSocket(`ws://${SERVER_ADDRESS}`);
    socket.onopen = (event) => {
        // Connection opened, send data
        // socket.send(JSON.stringify({
        //     action: "join",
        //     user: p.name
        // }));
        performAuthentication();
        requestAnimationFrame(draw);
        update();
    };

    socket.onclose = (event) => {
        // Connection closed
    };

    socket.onmessage = (event) => {
        // Handle incoming messages from the server
        const data = JSON.parse(event.data);

        // Skip if the message is from the current user
        if (data.user != player.name) {
            if (data.action == "join") {
                // Handle new player joining
                otherClients.push(new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`, data.user));
            } else if (data.action == "update") {
                // Handle player updates
                for (let client of otherClients) {
                    if (client.name == data.user) {
                        client.position.x = data.position.x;
                        client.position.y = data.position.y;

                        client.velocity.x = data.velocity.x;
                        client.velocity.y = data.velocity.y;
                    }
                }
            } else if (data.action == "remove") {
                // Handle player removal
                let index = -1;
                for (let i = 0; i < otherClients.length; i++) {
                    if (otherClients[i].name == data.user) {
                        index = i;
                    }
                }
                if (index !== -1) {
                    otherClients.splice(index, 1);
                }
            } else if (data.action === "register_response") {
                // Handle the registration response, store the authentication token, and perform subsequent actions
                const authToken = data.token; // Receive the authentication token from the server
                localStorage.setItem("authToken", authToken);
            }
        }
    };
}

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    GAME_OBJECTS.forEach(mObject => {
        if (mObject.show) {
            mObject.show();
        }
    });

    // Joust Map Example
    // ctx.drawImage(mapRef, 0, 0, canvas.width, canvas.height);

    // if (fire) {
    //     fire.show(2, 28, 388 - fire.images[0].size.y * fire.scalar);
    //     fire.show(2, canvas.width - 28, 388 - fire.images[0].size.y * fire.scalar);
    // }

    for (let client of otherClients) {
        client.show();
    }

    for (let death of deaths) {
        death.show();
    }
    // Draw fps
    ctx.font = "10px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - lastFrameTime))}`, 10, 20);

    // Draw delta
    ctx.fillText(`Delta: ${Math.round(performance.now() - lastUpdateTime)}ms`, 10, 40);

    lastFrameTime = performance.now();
    frameCount++;
    requestAnimationFrame(draw);
};


function update() {
    const message = {
        action: "update",
        user: player.name,
        content: {
            position: {
                x: player.position.x,
                y: player.position.y
            },
            velocity: {
                x: player.velocity.x,
                y: player.velocity.y
            }
        },
    };


    // Only send if the message has changed
    if (socket) {
        if (JSON.stringify(message) !== JSON.stringify(lastSent)) {
            // socket.send(JSON.stringify(message));
            lastSent = message;
        }
    }

    if (!lastSent) {
        lastSent = message;
    }

    GAME_OBJECTS.forEach(mObject => {
        if (mObject.update) {
            mObject.update();
        }
        if (mObject.dumbAI) {
            mObject.dumbAI();
        }
    });
    for (let client of otherClients) {
        client.update();
    }

    for (let i = GAME_OBJECTS.length - 1; i >= 0; i--) {
        if (GAME_OBJECTS[i].dead) {
            GAME_OBJECTS.splice(i, 1);
        } else if (GAME_OBJECTS[i].collisionObjects) {
            GAME_OBJECTS[i].collisionObjects = [];
        }
    }
    // }
    //     // if (isColliding(p, AIs[i])) {
    //     //     if (p.position.y + p.size.y - (p.currentAnimation.images[0].height * p.currentAnimation.scalar) < AIs[i].position.y + AIs[i].size.y - (AIs[i].currentAnimation.images[0].size.y * AIs[i].currentAnimation.scalar)) {
    //     //         deaths.push(new DeathAnimation(AIs[i].position, AIs[i].velocity));

    //     //         AIs.splice(i, 1);
    //     //         if(AIs.length==0){
    //     //             ground.position.x = 79;
    //     //             ground.size.x = 303;
    //     //         }
    //     //         continue;
    //     //     } else {
    //     //         console.log("You Died");
    //     //     }
    //     // }
    //     if (Math.random() < 0.1) {
    //         if (AIs[i].position.y > p.position.y) {
    //             AIs[i].isJumping = true;
    //             AIs[i].velocity.y -= 3;
    //             if (AIs[i].velocity.y < -3) {
    //                 AIs[i].velocity.y = -3;
    //             }
    //         } else {
    //             if (Math.random() < 0.1) {
    //                 AIs[i].isJumping = true;
    //                 AIs[i].velocity.y -= 3;
    //                 if (AIs[i].velocity.y < -3) {
    //                     AIs[i].velocity.y = -3;
    //                 }
    //             }
    //         }
    //     }
    //     switch (AIs[i].velocity.x > 0) {
    //         case true:
    //             AIs[i].jumpDirection = false;
    //             if (Math.abs(AIs[i].velocity.x) == 0) {
    //                 AIs[i].velocity.x = 1;
    //                 AIs[i].xAccel = 0.05;
    //             } else {
    //                 AIs[i].xAccel = 0.07;
    //             }
    //             break;
    //         case false:
    //             AIs[i].jumpDirection = true;
    //             if (Math.abs(AIs[i].velocity.x) == 0) {
    //                 AIs[i].velocity.x = -1;
    //                 AIs[i].xAccel = -0.05;
    //             } else {
    //                 AIs[i].xAccel = -0.07;
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // for (let i = 0; i < AIs.length; i++) {
    //     mapBlockCollision.forEach(mObject => {
    //         handleCollision(AIs[i], mObject);
    //     });
    // }


    GAME_OBJECTS.forEach(mObject1 => {
        GAME_OBJECTS.forEach(mObject2 => {
            if (mObject1 !== mObject2) {
                handleCollision(mObject1, mObject2, mObject1.collider, mObject2.collider);
            }
        });
    });

    lastUpdateTime = performance.now();
    setTimeout(update, 1000 / FRAME_RATE);
}

if (!socket) {
    requestAnimationFrame(draw);
    update();
}
export function spawnNewAi() {
    new Enemy(Math.random() * 800, 20, 13 * 2, 18 * 2, "green");
}
export { ctx, GAME_OBJECTS, canvas, player };