function interpolate(t, start, end) {
    // Make sure t is within the range [0, 1]
    t = Math.max(0, Math.min(1, t));

    // Calculate the interpolated value
    return start + (end - start) * t;
}
