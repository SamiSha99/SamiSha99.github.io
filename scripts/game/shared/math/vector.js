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

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        x !== undefined && (this.x = x);
        y !== undefined && (this.y = y);
        z !== undefined && (this.z = z);
    }

    add(x = 0, y = 0, z = 0) {
        return new Vector3(this.x + x, this.y + y, this.z + z);
    }

    addVector(vec) {
        return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    subtract(x = 0, y = 0, z = 0) {
        return new Vector3(this.x - x, this.y - y, this.z - z);
    }

    subtractVector(vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    multiply(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    divide(scalar) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3(0, 0, 0);
        return this.divide(len);
    }

    cross(vec) {
        return new Vector3(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
        );
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}

class Vector4 {
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    set(x, y, z, w) {
        x !== undefined && (this.x = x);
        y !== undefined && (this.y = y);
        z !== undefined && (this.z = z);
        w !== undefined && (this.w = w);
    }

    add(x = 0, y = 0, z = 0, w = 0) {
        return new Vector4(this.x + x, this.y + y, this.z + z, this.w + w);
    }

    addVector(vec) {
        return new Vector4(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w);
    }

    subtract(x = 0, y = 0, z = 0, w = 0) {
        return new Vector4(this.x - x, this.y - y, this.z - z, this.w - w);
    }

    subtractVector(vec) {
        return new Vector4(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }

    multiply(scalar) {
        return new Vector4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }

    divide(scalar) {
        return new Vector4(this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector4(0, 0, 0, 0);
        return this.divide(len);
    }

    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
}

export { Vector2, Vector3, Vector4 };
