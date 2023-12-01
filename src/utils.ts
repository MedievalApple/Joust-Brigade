export function lerp(t, start, end) {
    return start + t * (end - start);
}

export function constrain(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}
