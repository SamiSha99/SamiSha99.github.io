import { Vector2 } from "../core/math.js";
import { Assets } from "../core/game.js";

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
            this.name = name ?? "Unnamed Sprite";
            this.image.width = this.image.naturalWidth;
            this.image.height = this.image.naturalHeight;

            this.cols = cols;
            if (cols > 1) this.frameWidth = this.image.width / cols;
            else this.frameWidth = frameWidth;

            this.rows = rows;
            if (rows > 1) this.frameHeight = this.image.height / rows;
            else this.frameHeight = frameHeight;
        };
        this.image.src = imagePath;
        this.size = size;
        this.frameTime = frameTime;
    }

    static fromEntity({ type, size }, image) {
        return new Sprite({ name: type, size: size, imagePath: image });
    }

    load(path) {
        console.log(assets);
        this.image.src = Assets.get(path);
        return this;
    }

    animate(ctx, time, location, col, row) {
        ctx.drawImage(
            this.image,
            Math.max(0, Math.round((time % 1) / this.frameTime) - 1) *
                this.frameWidth,
            row * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            location.x,
            location.y,
            this.size.x,
            this.size.y
        );
    }
}

export { Sprite };
