// 10.223.17.4:3000
import { Socket, io } from "socket.io-client";
import { GAME_OBJECTS, PLAYER_HEIGHT, PLAYER_USERNAME, PLAYER_WIDTH} from "./joust";
import { Enemy, Player } from "./player";
import { advancedLog } from "./utils";
import { InputHandler } from "./controls";
import { Direction } from "./enums";

export const SERVER_ADDRESS = localStorage.getItem("server");
export let player; 
// Client → Server
// Server → Client
export interface SharedEvents {}

// Client → Server
export interface ClientEvents extends SharedEvents {
    move: (x: number, y: number, velx: number, vely:number, xAccel: number, isJumping:boolean, direction:Direction) => void;
    playerJoined: (playerName: string) => void;
}

// Server → Client
export interface ServerEvents extends SharedEvents {
    playerMoved: (playerID: string, x: number, y: number, velx: number, vely:number, xAccel: number, isJumping:boolean, direction:Direction) => void;
    playerJoined: (playerID: string, playerName: string) => void;
    enemyJoined: (enemyID: string, EnemyName: string) => void;
    playerLeft: (playerID: string) => void;
}

// append to initial socket request, username
export const socket: Socket<ServerEvents, ClientEvents> = io(SERVER_ADDRESS);

socket.on("connect", () => {
    advancedLog("Connected to server!", "#32a852", "🚀");
    socket.emit("playerJoined", PLAYER_USERNAME);
    player = new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, "red", PLAYER_USERNAME, socket.id);
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
        GAME_OBJECTS.set(id, new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, "orange", player, id));
        console.log(GAME_OBJECTS)
    }
});

socket.on("enemyJoined", (id, name) => {
    advancedLog(`AI ${name} joined!`, "#32a852", "🚀");
    GAME_OBJECTS.set(id, new Enemy(50, 310, -100, -100, "blue", name));
});

socket.on("playerMoved", (playerID, x: number, y: number, velx: number, vely:number, xAccel: number, isJumping:boolean, direction:Direction) => {
    const player = GAME_OBJECTS.get(playerID);

    if (player instanceof Player) {
        player.position.x = x;
        player.position.y = y;
        player.velocity.x = velx;
        player.velocity.y = vely;
        player.xAccel = xAccel;
        player.isJumping = isJumping;
        player.direction = direction;
        player.updateCollider(player.position);
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