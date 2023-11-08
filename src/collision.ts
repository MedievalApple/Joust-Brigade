import { Collider, IHitbox, MapObject } from "./map_object";
import { Vector } from "./vector";

export function isColliding(object1: Collider, object2: Collider) {
    return (
        object1.collisionX < object2.collisionX + object2.collisionSize.x &&
        object1.collisionX + object1.collisionSize.x > object2.collisionX &&
        object1.collisionY < object2.collisionY + object2.collisionSize.y &&
        object1.collisionY + object1.collisionY > object2.collisionY
    );
}

export function handleCollision(
    gameObject1: { position: Vector, velocity: Vector },
    gameObject2: { position: Vector, velocity: Vector },
    collider1: Collider, 
    collider2: Collider
) {
    // No need to check if they're overlapping, and then calculate the overlap
    // you can calculate overlap first and then check if it's 0 on both overlapX and overlapY
    // to determine collision

    // Bonus:
    // Alternatively, you can take a 2 phase approach to collision, a broad phase and a narrow phase
    // quickly determine if two objects are not likely to collide (small size and far away), and then
    // skip collision checking for those altogether

    if (isColliding(collider1, collider2)) {
        // Calculate the overlap on each axis
        const overlapX = Math.min(
            collider1.collisionX + collider1.collisionSize.x - collider2.collisionX,
            collider2.collisionX + collider2.collisionSize.x - collider1.collisionX
        );
        const overlapY = Math.min(
            collider1.collisionX + collider1.collisionSize.y - collider2.collisionY,
            collider2.collisionX + collider2.collisionSize.y - collider1.collisionY
        );

        // Determine which axis has the smallest overlap (penetration)
        if (overlapX < overlapY) {
            // Resolve the collision on the X-axis
            const sign = Math.sign(gameObject1.velocity.x - gameObject2.velocity.x);
            gameObject1.position.x -= overlapX * sign;
            gameObject2.velocity.x *= -1;
        } else {
            // Resolve the collision on the Y-axis
            const sign = Math.sign(gameObject1.velocity.y - gameObject2.velocity.y);
            // if(sign>0) { collider1.blockInfo = {x:collider2.position.x, y:collider2.position.y, w:collider2.size.x};}
            gameObject1.position.y -= overlapY * sign;
            gameObject2.velocity.y *= -0.8;
        }
    }
}