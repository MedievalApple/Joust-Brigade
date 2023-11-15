import { GAME_OBJECTS, player } from "./joust";
import { Collider, IHitbox, MapObject } from "./map_object";
import { Enemy, Player } from "./player";
import { Vector } from "./vector";

// export function isColliding(object1: Collider, object2: Collider) {
//     return (
//         object1.collisionX < object2.collisionX + object2.collisionSize.x &&
//         object1.collisionX + object1.collisionSize.x > object2.collisionX &&
//         object1.collisionY < object2.collisionY + object2.collisionSize.y &&
//         object1.collisionY + object1.collisionY > object2.collisionY
//     );
// }

export interface ICollisionObject {
    position: Vector;
    velocity: Vector;
    isJumping?: boolean;
    static?: boolean;
    collisionObjects?: Array<ICollisionObject>;
}

export function handleCollision(
    gameObject1: ICollisionObject,
    gameObject2: ICollisionObject,
    collider1: Collider,
    collider2: Collider
) {
    if (gameObject1.velocity.x == 0 && gameObject1.velocity.y == 0 && gameObject2.velocity.x == 0 && gameObject2.velocity.y == 0) return;
    // No need to checkx if they're overlapping, and then calculate the overlap
    // you can calculate overlap first and then check if it's 0 on both overlapX and overlapY
    // to determine collision

    // Bonus:
    // Alternatively, you can take a 2 phase approach to collision, a broad phase and a narrow phase
    // quickly determine if two objects are not likely to collide (small size and far away), and then
    // skip collision checking for those altogether

    // Calculate the overlap on each axis
    const overlapX = Math.min(
        collider1.collisionX + collider1.collisionSize.x - collider2.collisionX,
        collider2.collisionX + collider2.collisionSize.x - collider1.collisionX
    );

    const overlapY = Math.min(
        collider1.collisionY + collider1.collisionSize.y - collider2.collisionY,
        collider2.collisionY + collider2.collisionSize.y - collider1.collisionY
    );

    if (overlapX >= 0 && overlapY >= 0) {
        if (gameObject1.collisionObjects) {
            gameObject1.collisionObjects.push(gameObject2);
        }

        if (gameObject2.collisionObjects) {
            gameObject2.collisionObjects.push(gameObject1);
        }

        if ((gameObject1.constructor.name == "Player" && gameObject2.constructor.name == "Enemy")||(gameObject2.constructor.name == "Player" && gameObject1.constructor.name == "Enemy")) {
            console.log(gameObject1, gameObject2)
            if (gameObject1 instanceof Enemy&&gameObject1.constructor.name == "Enemy") {
                gameObject1.dead = true;
            } else if (gameObject2 instanceof Enemy&&gameObject2.constructor.name == "Enemy") {
                gameObject2.dead = true;
            }
        }
        // Determine which axis has the smallest overlap (penetration)
        if (overlapX < overlapY) {
            // Resolve the collision on the X-axis
            const sign = Math.sign(gameObject1.velocity.x - gameObject2.velocity.x);
            if (!gameObject1.static) gameObject1.position.x -= overlapX * sign;
            if (!gameObject2.static) gameObject2.velocity.x *= -1;
        } else {
            // Resolve the collision on the Y-axis
            const sign = Math.sign(gameObject1.velocity.y - gameObject2.velocity.y);
            if (sign < 0) {
                gameObject2.isJumping = false;
            }
            if (!gameObject1.static) {
                gameObject1.position.y -= overlapY * sign;
            }
            if (!gameObject2.static) {
                gameObject2.velocity.y *= -collider2.friction;
            }
        }
    }

}