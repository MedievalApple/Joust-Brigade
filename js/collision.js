function isColliding(object1, object2) {
    return (
        object1.position.x < object2.position.x + object2.width &&
        object1.position.x + object1.width > object2.position.x &&
        object1.position.y < object2.position.y + object2.height &&
        object1.position.y + object1.height > object2.position.y
    );
}

function handleCollision(object1, object2) {
    if (isColliding(object1, object2)) {
        // Calculate the overlap on each axis
        const overlapX = Math.min(
            object1.position.x + object1.width - object2.position.x,
            object2.position.x + object2.width - object1.position.x
        );
        const overlapY = Math.min(
            object1.position.y + object1.height - object2.position.y,
            object2.position.y + object2.height - object1.position.y
        );

        // Determine which axis has the smallest overlap (penetration)
        if (overlapX < overlapY) {
            // Resolve the collision on the X-axis
            const sign = Math.sign(object1.velocity.x - object2.velocity.x);
            object1.position.x -= overlapX * sign;
            object1.velocity.x *= -1;
        } else {
            // Resolve the collision on the Y-axis
            const sign = Math.sign(object1.velocity.y - object2.velocity.y);
            object1.position.y -= overlapY * sign;
            object1.velocity.y *= -1;
        }
    }
}