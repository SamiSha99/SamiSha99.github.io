import { Vector2 } from "../math.js";
import { Assets } from "../game.js";

class Sprite {
    constructor({
        name,
        imagePath,
        cols = 1,
        rows = 1,
        size = new Vector2(128, 128),
        frameTime = 0.1,
        anchor,
    }) {
        this.name = name ?? "Unnamed Sprite";

        this.image = new Image();
        this.image.src = imagePath;
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
            this.width = this.image.naturalWidth;
            this.height = this.image.naturalHeight;

            this.cols = cols;
            this.rows = rows;

            this.frameWidth = this.cols > 1 ? this.width / this.cols : this.width;
            this.frameHeight = this.rows > 1 ? this.height / this.rows : this.height;
        };

        this.size = size;
        this.frameTime = frameTime; // seconds per frame
        this.anchor = anchor ?? new Vector2(0, 0);
    }

    /**
     * Returns the current frame index for a given time and row/column offset.
     */
    getFrame(time, row = 0) {
        if (!this.imageLoaded) return 0;
        const totalFrames = this.cols;
        // frame index based on frameTime
        const frame = Math.floor(time / this.frameTime) % totalFrames;
        return { frame, row };
    }

    /**
     * Returns UV coordinates (0-1) for a given frame.
     * Used for WebGL texturing.
     */
    getTexCoords({ frame, row }) {
        if (!this.imageLoaded) return [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];

        const u0 = (frame * this.frameWidth) / this.width;
        const v0 = (row * this.frameHeight) / this.height;
        const u1 = u0 + this.frameWidth / this.width;
        const v1 = v0 + this.frameHeight / this.height;

        // two triangles UVs: TL, TR, BL, TR, BL, BR
        return [u0, v0, u1, v0, u0, v1, u1, v0, u0, v1, u1, v1];
    }

    load(path) {
        this.imageLoaded = false;
        this.image.src = Assets.get(path);
        return this;
    }
}

export { Sprite };
