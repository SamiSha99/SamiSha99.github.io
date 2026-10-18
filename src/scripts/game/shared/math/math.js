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

    static hslToRgb(h, s, l) {
        const a = s * Math.min(l, 1 - l);
        const f = (n) => {
            const k = (n + h / 30) % 12;
            return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        };
        return [f(0), f(8), f(4)];
    }
}

export { MathUtils };
