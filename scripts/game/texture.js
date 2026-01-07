import { Vector2 } from "./math.js";
import { assets } from "./properties.js";

class Sprite {
    constructor({
        name,
        imagePath,
        frameWidth,
        frameHeight,
        cols = 1,
        rows = 1,
        size = new Vector2(128, 128),
        frameTime = 0.1,
    }) {
        this.image = new Image();
        this.image.onload = (e) => {
            console.log(`Loaded sprite:`, e.target);
            this.name = name ?? "Unnamed Sprite";
            this.image.width = this.image.naturalWidth;
            this.image.height = this.image.naturalHeight;

            this.cols = cols;
            if (cols > 1) this.frameWidth = this.image.width / cols;
            else this.frameWidth = frameWidth;

            this.rows = rows;
            if (rows > 1) this.frameHeight = this.image.height / rows;
            else this.frameHeight = frameHeight;
            console.log(this);
        };
        this.image.src = imagePath;
        this.size = size;
        this.frameTime = frameTime;
    }

    load(path) {
        this.image.src = assets.get(path);
        return this;
    }

    animate(ctx, time, location, col, row) {
        ctx.drawImage(
            // Sprite sheet
            this.image,
            // The sprite frame to draw
            Math.max(0, Math.round((time % 1) / this.frameTime) - 1) *
                this.frameWidth,
            row * this.frameHeight,
            // Size of the sprite frame
            this.frameWidth,
            this.frameHeight,
            // location of the sprite frame
            location.x,
            location.y,
            // size on the canvas
            this.size.x,
            this.size.y
        );
    }
}

export { Sprite };
