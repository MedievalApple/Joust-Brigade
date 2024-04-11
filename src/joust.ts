import { Player } from './Bird Objects/player';
import { GAME_OBJECTS } from './map_object';
import { DEBUG } from './debug';
import { EnemyHandler } from './Bird Objects/enemy';
import { UnmountedAI } from "./death";
import {canvas, ctx} from "./Global Constants/canvas"
import { lastFrameTime, lastUpdateTime } from './Global Constants/constants';
import { StateManager } from './GameStateManager';
var previousTime = 0;
console.log("Joust game started!");

// Frame count and lastSent data
export var frameCount = 0;

// Player creation
//const player = new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR, PLAYER_USERNAME);

// Instantiate enemy handler
export const enemyHandler = EnemyHandler.getInstance(5);

// Game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    GAME_OBJECTS.forEach(mObject => {
        if (mObject.show) {
            mObject.show();
        }
    });
    let lastFrameTime = performance.now();
    if (DEBUG) {
        // Draw fps
        ctx.font = "10px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - lastFrameTime))}`, 10, 20);

        // Draw delta
        ctx.fillText(`Delta: ${Math.round(performance.now() - lastUpdateTime)}ms`, 10, 40);
    }

    // position 91 + 32, 388 + 12
    // size 112, 16
    // text: "10,000"
    // color: "blue"
    // make sure to fit the text in the box

    frameCount++;
    requestAnimationFrame(draw);
};

function update() {
    let currentTime = performance.now();
    let deltaTime = (currentTime - previousTime)/1000; // Convert milliseconds to seconds
    previousTime = currentTime;
    GAME_OBJECTS.forEach(mObject => {
        // @ts-ignore
        if(mObject.constructor == UnmountedAI) {mObject.update(); mObject.dumbAI();}
        if (!sessionStorage.getItem("server") || mObject.constructor == Player) {
            // @ts-ignore
            if (mObject.update) mObject.update(deltaTime);
        }
    });

    if (enemyHandler.enemies.length == 0 && !enemyHandler.spawningWave && !sessionStorage.getItem("server")) {
        enemyHandler.createEnemy(5);
    }

    StateManager.updateCollisions();
    requestAnimationFrame(update);
}

requestAnimationFrame(draw);
requestAnimationFrame(update);

export {GAME_OBJECTS};