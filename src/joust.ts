import { Player, EnemyHandler } from './player';
import { handleCollision } from './collision';
import { InputHandler } from './controls';
import { GAME_OBJECTS } from './map_object';
import { UnmountedAI } from './death';

// Canvas and context initialization
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Constants for readability
export const FRAME_RATE = 60;
let lastFrameTime = 0;
let lastUpdateTime = 0;

const SERVER_ADDRESS = localStorage.getItem("server");
export const PLAYER_WIDTH = 13 * 2;
export const PLAYER_HEIGHT = 18 * 2;
const PLAYER_COLOR = "red";
const LOCAL_USERNAME = localStorage.getItem("username");

// Arrays for other clients, AIs, and map blocks
const otherClients = [];

// Frame count and lastSent data
export var frameCount = 0;

// Player creation
const player = new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, LOCAL_USERNAME);

// Instantiate enemy handler
const enemyHandler = new EnemyHandler(5);

new UnmountedAI(100,100,PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, null)

// REMEMBER TO FIX DIFFERENCE BETWEEN UPPERCASE/LOWERCASE
new InputHandler({
    "a": {
        keydown: player.handleLeft.bind(player)
    },
    "d": {
        keydown: player.handleRight.bind(player)
    },
    "w": {
        keydown: player.jumpKeyDown.bind(player),
        keyup: player.jumpKeyUp.bind(player)
    },
    // "ArrowLeft": {
    //     keydown: enemyHandler.createEnemy.bind(enemyHandler)
    // }
})

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    GAME_OBJECTS.forEach(mObject => {
        if (mObject.show) mObject.show();
    });

    for (let client of otherClients) {
        client.show();
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
    GAME_OBJECTS.forEach(mObject => {
        if (mObject.update) mObject.update();
        if (mObject.dumbAI) mObject.dumbAI();
    });

    for (let client of otherClients) {
        client.update();
    }

    for (let i = GAME_OBJECTS.length - 1; i >= 0; i--) {
        if (GAME_OBJECTS[i].dead) {
            GAME_OBJECTS.splice(i, 1);
        } 
        
        if (GAME_OBJECTS[i].collisionObjects) {
            GAME_OBJECTS[i].collisionObjects = [];
        }
    }

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

requestAnimationFrame(draw);
update();

export { ctx, GAME_OBJECTS, canvas, player };