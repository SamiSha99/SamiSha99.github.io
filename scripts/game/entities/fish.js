import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Assets, Game } from "../core/game.js";
import { Sprite } from "../core/rendering/sprite.js";

class Fish extends Entity {
    size = new Vector2(128, 128);

    sprite = new Sprite({
        name: "Fish",
        size: this.size,
        imagePath: Assets.get("images/fish/smallswim.png"),
        cols: 10,
        rows: 5,
        frameTime: 0.1,
    });

    typeReference = { 0: 0, 1: 1, 2: 2, 3: 4 };
    typeCol = 0;
    offsetTime = Math.random();

    constructor() {
        super();

        this.direction = Math.random() < 0.5 ? -1 : 1;

        this.location = new Vector2(
            this.direction === -1
                ? Game.canvas.width + this.sprite.size.x
                : -this.sprite.size.x,
            MathUtils.rangeRandInt(0, Game.canvas.height - this.sprite.size.y)
        );

        this.typeCol = this.GetFishType();
        this.speed = MathUtils.randRange(75, 150);

        if (!this.sprite.glTexture) {
            Game.renderer.spriteProgram.gl.bindTexture(
                Game.renderer.gl.TEXTURE_2D,
                null
            );
            Game.renderer.loadTexture(this.sprite);
        }
    }

    update(delta) {
        this.location.x += this.speed * delta * this.direction;

        if (
            this.location.x < -this.sprite.size.x ||
            this.location.x > Game.canvas.width + this.sprite.size.x
        ) {
            this.destroy();
        }
    }

    draw(_gl, renderer, _delta) {
        if (!this.sprite.imageLoaded) return;

        const time = Game.renderer.time.currentTime + this.offsetTime;
        const frameData = this.sprite.getFrame(time, this.typeCol);
        const texCoords = this.sprite.getTexCoords(frameData);

        let x0 = this.location.x;
        let x1 = this.location.x + this.size.x;
        const y0 = this.location.y;
        const y1 = this.location.y + this.size.y;

        if (this.direction === 1) [x0, x1] = [x1, x0]; // flip horizontally

        const vertices = [x0, y0, x1, y0, x0, y1, x1, y0, x0, y1, x1, y1];

        renderer.spriteProgram.draw(vertices, texCoords, this.sprite.glTexture);
    }

    GetFishType() {
        const keys = Object.keys(this.typeReference);
        return this.typeReference[
            keys[MathUtils.rangeRandInt(0, keys.length - 1)]
        ];
    }
}

export { Fish };
