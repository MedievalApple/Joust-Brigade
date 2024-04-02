import { Player } from "./Bird Objects/player";
import { handleCollision } from "./collision";
import { UnmountedAI } from "./death";
import { GAME_OBJECTS, Platform, filter } from "./map_object";

export class StateManager {
    public static singlePlayer: boolean = false;
    static updateCollisions() { 
        if(this.singlePlayer) {
        }
        else {
            filter(Player).forEach(mObject1 => {
                filter(Platform).forEach(mObject2 => {
                    if (mObject1.collider && mObject2.collider) {
                        handleCollision(mObject1, mObject2, mObject1.collider, mObject2.collider);
                    }
                });
            });
            filter(UnmountedAI).forEach(mObject1 => {
                filter(Platform).forEach(mObject2 => {
                    if (mObject1.collider && mObject2.collider) {
                        handleCollision(mObject1, mObject2, mObject1.collider, mObject2.collider);
                    }
                });
            });
        }
    }
    static updateScore() {

    }
}