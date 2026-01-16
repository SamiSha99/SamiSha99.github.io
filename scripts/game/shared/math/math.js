class MathUtils {
    static randRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    static rangeRandInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static lerp(start, end, t) {
        return start + t * (end - start);
    }
}

export { MathUtils };
