// 10.223.17.4:3000
import { Socket, io } from "socket.io-client";
import {
    GAME_OBJECTS,
    PLAYER_HEIGHT,
    PLAYER_USERNAME,
    PLAYER_WIDTH,
} from "./joust";
import { Enemy, Player, UnmountedAI } from "./player";
import { advancedLog } from "./utils";
import { InputHandler } from "./controls";
import { Direction } from "./enums";
import { AniSprite, ImgSprite } from "./sprite";
import { Vector } from "./vector";
export const SERVER_ADDRESS = sessionStorage.getItem("server");
export let LOCAL_PLAYER: Player;

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

// append to initial socket request, username
export const socket: Socket<ServerEvents, ClientEvents> = io(SERVER_ADDRESS);

socket.on("connect", () => {
    advancedLog("Connected to server!", "#32a852", "🚀");
    socket.emit("playerJoined", PLAYER_USERNAME);
    // Clear the game objects that are not the local player/platforms
    for (const [id, gameObject] of GAME_OBJECTS) {
        if (gameObject instanceof Player) {
            if (gameObject.name !== PLAYER_USERNAME) {
                GAME_OBJECTS.delete(id);
            }
        }
    }
    if (!LOCAL_PLAYER) {
        LOCAL_PLAYER = new Player(
            50,
            310,
            PLAYER_WIDTH,
            PLAYER_HEIGHT,
            "yellow",
            PLAYER_USERNAME,
            socket.id
        );

        new InputHandler({
            a: {
                keydown: LOCAL_PLAYER.handleLeft.bind(LOCAL_PLAYER),
            },
            d: {
                keydown: LOCAL_PLAYER.handleRight.bind(LOCAL_PLAYER),
            },
            w: {
                keydown: LOCAL_PLAYER.jumpKeyDown.bind(LOCAL_PLAYER),
                keyup: LOCAL_PLAYER.jumpKeyUp.bind(LOCAL_PLAYER),
            },
        });
    } else {
        LOCAL_PLAYER.name = PLAYER_USERNAME;
        LOCAL_PLAYER.id = socket.id;
        LOCAL_PLAYER.position = new Vector(50, 310);

        GAME_OBJECTS.set(LOCAL_PLAYER.id, LOCAL_PLAYER);
    }
});

socket.on("disconnect", () => {
    advancedLog("Disconnected from server!", "red", "🚀");
});

socket.on("playerJoined", (id, player) => {
    advancedLog(`${player} joined!`, "#32a852", "🚀");
    GAME_OBJECTS.set(
        id,
        new Player(50, 310, PLAYER_WIDTH, PLAYER_HEIGHT, "aqua", player, id, {
            running: new AniSprite(
                "/assets/sprite_sheet/stork/walk_stork/walk",
                4,
                {
                    animationSpeed: 10,
                    scale: new Vector(2, 2),
                    loop: true,
                }
            ),
            stop: new ImgSprite(
                "/assets/sprite_sheet/stork/walk_stork/stop.png",
                new Vector(2, 2)
            ),
            flap: new AniSprite(
                "/assets/sprite_sheet/stork/flap_stork/flap",
                2,
                {
                    animationSpeed: 0,
                    scale: new Vector(2, 2),
                    loop: true,
                }
            ),
            idle: new ImgSprite(
                "/assets/sprite_sheet/stork/idle_stork/idle_standing.png",
                new Vector(2, 2)
            ),
        })
    );
});

socket.on("enemyJoined", (id, name) => {
    advancedLog(`AI ${name} joined!`, "#32a852", "🚀");
    GAME_OBJECTS.set(id, new Enemy(50, 310, -100, -100, "red", id, name));
});

socket.on(
    "playerMoved",
    (
        playerID,
        x: number,
        y: number,
        velx: number,
        vely: number,
        xAccel: number,
        isJumping: boolean,
        direction: Direction
    ) => {
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
            if (player.constructor == Player && player.currentAnimation instanceof AniSprite && isJumping) {
                player.currentAnimation.next();
            }
        }
    }
);

socket.on("playerLeft", (playerID: string) => {
    advancedLog(`${playerID} left!`, "red", "🚀");

    const player = GAME_OBJECTS.get(playerID);
    if (player instanceof Player) {
        advancedLog(
            `${GAME_OBJECTS.delete(playerID) ? "Successfully" : "Failed to"
            } delete ${player.name}`,
            "red",
            "🚀"
        );
        if (player.constructor == Enemy) {
            new UnmountedAI(player.position.x, player.position.y, PLAYER_WIDTH, PLAYER_HEIGHT, "red", null, player.id);
        }
    }
});
socket.on("flip", (playerID: string) => {
    const player = GAME_OBJECTS.get(playerID);
    if (player instanceof Player) {
        player.direction = player.direction == Direction.Right ? Direction.Left : Direction.Right;
        player.velocity.x *= -1;
        advancedLog(`${player.name} Change directions!`, "red", "🚀");
    }
});

socket.on("dead", (playerID: string) => {
    const player = GAME_OBJECTS.get(playerID);
    if (player instanceof Player) {
        player.position = new Vector(200, 310);
        advancedLog(`${player.name} Died!`, "red", "🚀");
    }
});

socket.on("connect_error", (err) => {
    advancedLog(`connect_error due to ${err.message}`, "red", "🚀");
});

advancedLog("Client handler loaded", "orange", "🚀");
