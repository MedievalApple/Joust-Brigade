import { Vector } from "../vector";

export interface ICollisionObject {
    position: Vector;
    velocity: Vector;
    isJumping?: boolean;
    static?: boolean;
    collisionObjects?: Array<ICollisionObject>;
    updateCollider?: (vector: Vector) => void;
}

export interface IHitbox {
    offset: Vector;
    size: Vector;
}

export class OffsetHitbox implements IHitbox {
    offset: Vector;
    size: Vector;

    constructor(offset: Vector, size: Vector) {
        this.offset = offset;
        this.size = size;
    }
}

export class CircleHitbox implements IHitbox {
    offset: Vector;
    size: Vector;

    constructor(offset: Vector, size: Vector) {
        this.offset = offset;
        this.size = size;
    }
}