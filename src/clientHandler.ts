console.log("clientHandler.ts");

import { io } from "socket.io-client";
import { PLAYER_USERNAME } from "./joust";

export const SERVER_ADDRESS = localStorage.getItem("server");
export const socket = io(SERVER_ADDRESS);

socket.on("connect", () => {
    console.log("Connected to server!");
    socket.emit("join", PLAYER_USERNAME);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server!");
});

socket.on("playerJoined", (player) => {
    console.log(`${player} joined!`);
});

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

console.log(socket);