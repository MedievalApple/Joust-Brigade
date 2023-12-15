// 10.223.17.4:3000
import { Socket, io } from "socket.io-client";
import { GAME_OBJECTS, PLAYER_HEIGHT, PLAYER_USERNAME, PLAYER_WIDTH, player } from "./joust";
import { Enemy, Player } from "./player";
import { advancedLog } from "./utils";
import { v4 as uuidv4 } from "uuid";

export const SERVER_ADDRESS = localStorage.getItem("server");

// events that can go both ways
// what would join be classified as, for when the client shares its username with the server?

// join can be shared because the client will say hey i'm joining with this username,
// then the server will emit that same event back to the clients saying, hey everyone this guy joined with this username

// the reason move isn't shared is because clients should not be able to tell the server which username moved
export interface SharedEvents {
    playerLeft: (playerID: string) => void;
}

// no you don't want those 


// i know, but without them the animations break. i dont know 100% how to fix our player class to not need them
// events that that come from the client, also we need the velocity, and xAccel,

// you should just send isJumping and direction from the server then
// just have the server compute that stuff once and send it to all the clients,
// rather than giving all the clients the info and having them compute it

// there is no desync if the server is the source of truth
// if you're having performance issues that is causing stuff like rubberbanding it's an issue of either the code
// or the connection

// socketio will fallback to http if it can't establish the websocket

// so you should use the network tab to check that the websocket is properly established and its not falling back to http
// ok

// i might just ask u to help after i get home, so i dont cut into ur work time

// im on lunch
// ok!

// so a few things is if each method is loopthing through all the game objects and stuff

// my friends are asking wouldn't that cause rubberbanding? because idk, they said it could desync?

// and isJumping, and direction

// btw i hate the player class, i know it does too much
export interface ClientEvents extends SharedEvents {
    move: (x: number, y: number) => void;
    playerJoined: (playerName: string) => void;
}

// events that come from the server
export interface ServerEvents extends SharedEvents {
    playerMoved: (playerID: string, x: number, y: number) => void;
    playerJoined: (playerID: string, playerName: string) => void;
}

export const socket: Socket<ServerEvents, ClientEvents> = io(SERVER_ADDRESS);

socket.on("connect", () => {
    advancedLog("Connected to server!", "#32a852", "🚀");
    socket.emit("playerJoined", PLAYER_USERNAME);
});

socket.on("disconnect", () => {
    advancedLog("Disconnected from server!", "red", "🚀");
});

socket.on("playerJoined", (id, player) => {
    advancedLog(`${player} joined!`, "#32a852", "🚀");
    if (player === PLAYER_USERNAME) return;
    if (player.split(" ").includes("Enemy")) {
        GAME_OBJECTS.set(id, new Enemy(50, 310, -100, -100, "blue", player));
    } else {
        GAME_OBJECTS.set(id, new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, "blue", player));
    }
});

socket.on("playerMoved", (playerID, x, y) => {
    // advancedLog(`${playerID} moved to (${x}, ${y})!`, "blue", "🚀");

    const player = GAME_OBJECTS.get(playerID);
    if (player instanceof Player) {
        player.position.x = x;
        player.position.y = y;
    }
});

socket.on("playerLeft", (playerID: string) => {
    advancedLog(`${playerID} left!`, "red", "🚀");

    const player = GAME_OBJECTS.get(playerID);

    if (player instanceof Player) {
        advancedLog(`${GAME_OBJECTS.delete(playerID) ? "Successfully" : "Failed to"} delete ${playerID}!`, "red", "🚀");
    }
});

// update local player position every 100ms
// setInterval(() => {
//     socket.emit("move", {
//         username: PLAYER_USERNAME,
//         x: player.position.x,
//         y: player.position.y,
//         velocityX: player.velocity.x, 
//         velocityY: player.velocity.y,
//         xAccel: player.xAccel,
//         isJumping: player.isJumping,
//         direction: player.direction
//     });
// }, 30);

socket.on("connect_error", (err) => {
    advancedLog(`connect_error due to ${err.message}`, "red", "🚀");
});

advancedLog("Client handler loaded", "orange", "🚀");