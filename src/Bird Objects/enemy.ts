import { isColliding } from "../collision";
import { GAME_OBJECTS, Platform } from "../map_object";
import { Enemy } from "./player";

export class EnemyHandler {
    private static singleton: EnemyHandler;
    private _enemies: Enemy[] = [];

    spawningWave: boolean = false;

    private constructor(startingEnemies: number = 0) {
        this.spawningWave = true;
    }

    public static getInstance(number?: number): EnemyHandler {
        if (!EnemyHandler.singleton) {
            EnemyHandler.singleton = new EnemyHandler(number);
        }
        return EnemyHandler.singleton;
    }

    createEnemy(number: number = 1) {
        let alreadySpawned = number;
        for (let i = 0; i < number; i++) {
            let spawnablesSpots: Platform[] = [];

            for (let [_, value] of GAME_OBJECTS) {
                if (value instanceof Platform && value.spawner) {
                    spawnablesSpots.push(value);
                }
            }

            for (let i = spawnablesSpots.length - 1; i >= 0; i--) {
                for (var enemy of this.enemies) {
                    enemy.collider.show("red");
                    spawnablesSpots[i].spawner.show("blue");
                    if (
                        isColliding(enemy.collider, spawnablesSpots[i].spawner)
                    ) {
                        spawnablesSpots.splice(i, 1);
                        break;
                    }
                }
            }

            let spot =
                spawnablesSpots[
                Math.floor(Math.random() * spawnablesSpots.length)
                ];
            if (spawnablesSpots.length == 0) break;
            alreadySpawned--;
        }
        if (alreadySpawned > 0) {
            setTimeout(() => this.createEnemy(alreadySpawned), 1000);
        } else {
            this.spawningWave = false;
        }
    }

    set enemies(enemies: Enemy[]) {
        this._enemies = enemies;
    }

    get enemies(): Enemy[] {
        // remove dead enemies
        this._enemies = this._enemies.filter((enemy) => !enemy.dead);
        return this._enemies;
    }
}