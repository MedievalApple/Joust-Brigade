import { Socket, io } from "socket.io-client";
import { Direction } from "../enums";

// Constants for readability
export const FRAME_RATE = 60;
export let lastFrameTime = 0;
export let lastUpdateTime = 0;
export const PLAYER_WIDTH = 13 * 2;
export const PLAYER_HEIGHT = 18 * 2;
export const PLAYER_USERNAME = sessionStorage.getItem("username");
// Server Constants
// Client ←→ Server
export interface SharedEvents { }

// Client → Server
export interface ClientEvents extends SharedEvents {
    move: (
        x: number,
        y: number,
        velx: number,
        vely: number,
        xAccel: number,
        isJumping: boolean,
        direction: Direction
    ) => void;
    playerJoined: (playerName: string) => void;
}

// Server → Client
export interface ServerEvents extends SharedEvents {
    playerMoved: (
        playerID: string,
        x: number,
        y: number,
        velx: number,
        vely: number,
        xAccel: number,
        isJumping: boolean,
        direction: Direction
    ) => void;
    playerJoined: (playerID: string, playerName: string) => void;
    enemyJoined: (enemyID: string, EnemyName: string) => void;
    playerLeft: (playerID: string) => void;
    flip: (playerID: string) => void;
    dead: (playerID: string) => void;
}
export const SERVER_ADDRESS = sessionStorage.getItem("server");
export const socket: Socket<ServerEvents, ClientEvents> = io(SERVER_ADDRESS);
console.log(SERVER_ADDRESS);