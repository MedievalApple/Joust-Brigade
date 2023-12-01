// 10.223.17.4:3000
console.log("clientHandler.ts");

import { io } from "socket.io-client";
import { GAME_OBJECTS, PLAYER_HEIGHT, PLAYER_USERNAME, PLAYER_WIDTH, player } from "./joust";
import { Player } from "./player";

export const SERVER_ADDRESS = localStorage.getItem("server");
export const socket = io(SERVER_ADDRESS);

socket.on("connect", () => {
    console.log("[io] Connected to server!");
    socket.emit("join", PLAYER_USERNAME);
});

socket.on("disconnect", () => {
    console.log("[io] Disconnected from server!");
});

socket.on("join", (player) => {
    console.log(`[io] ${player} joined!`);
    if (player === PLAYER_USERNAME) return;

    GAME_OBJECTS.push(new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, "blue", player))
});

socket.on("move", (data) => {
    
    console.log(`[io] ${data.username} moved to (${data.x}, ${data.y})!`);
    
    for (let object of GAME_OBJECTS) {
        if(object instanceof Player) {
            if(object.name == data.username) {
                object.position.x = data.x;
                object.position.y = data.y;
                object.velocity.x = data.velocityX;
                object.velocity.y = data.velocityY;
                object.xAccel = data.xAccel;
                object.isJumping = data.isJumping;
                object.direction = data.direction;
            }
        }
    }
});

socket.on("leave", (player) => {
    console.log(`[io] ${player} left!`);
    for(let object of GAME_OBJECTS) {
        if(object instanceof Player) {
            if(object.name==player) {
                GAME_OBJECTS.splice(GAME_OBJECTS.indexOf(object), 1);
            }
        }
    }
});

// update local player position every 100ms
setInterval(() => {
    socket.emit("move", {
        username: PLAYER_USERNAME,
        x: player.position.x,
        y: player.position.y,
        velocityX: player.velocity.x, 
        velocityY: player.velocity.y,
        xAccel: player.xAccel,
        isJumping: player.isJumping,
        direction: player.direction
    });
}, 30);

socket.on("connect_error", (err) => {
    console.log(`[io] connect_error due to ${err.message}`);
});

console.log(socket);