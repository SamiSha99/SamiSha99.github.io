class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        x != undefined && (this.x = x);
        y != undefined && (this.y = y);
    }

    add(x = 0, y = 0) {
        return new Vector2(this.x + x, this.y + y);
    }

    addVector(vec) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    subtractVector(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    subtract(x = 0, y = 0) {
        return new Vector2(this.x - x, this.y - y);
    }

    multiply(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    divide(scalar) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector2(0, 0);
        return this.divide(len);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}

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

export { Vector2, MathUtils };
