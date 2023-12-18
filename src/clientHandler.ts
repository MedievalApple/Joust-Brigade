// 10.223.17.4:3000
import { Socket, io } from "socket.io-client";
import { GAME_OBJECTS, PLAYER_HEIGHT, PLAYER_USERNAME, PLAYER_WIDTH } from "./joust";
import { Enemy, Player } from "./player";
import { advancedLog } from "./utils";

export const SERVER_ADDRESS = localStorage.getItem("server");

// Client → Server
// Server → Client
export interface SharedEvents {}

// Client → Server
export interface ClientEvents extends SharedEvents {
    move: (x: number, y: number) => void;
    playerJoined: (playerName: string) => void;
}

// Server → Client
export interface ServerEvents extends SharedEvents {
    playerMoved: (playerID: string, x: number, y: number) => void;
    playerJoined: (playerID: string, playerName: string) => void;
    playerLeft: (playerID: string) => void;
}

// append to initial socket request, username
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

socket.on("connect_error", (err) => {
    advancedLog(`connect_error due to ${err.message}`, "red", "🚀");
});

advancedLog("Client handler loaded", "orange", "🚀");