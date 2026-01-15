import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Assets, Game } from "../core/game.js";
import { Sprite } from "../core/rendering/sprite.js";
import { buildQuadVertices } from "../core/rendering/glUtils.js";

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
                ? Game.canvas.width + this.sprite.size.x * 0.5
                : -this.sprite.size.x * 0.5,
            MathUtils.rangeRandInt(0, Game.canvas.height - this.sprite.size.y)
        );

        this.typeCol = this.GetFishType();
        this.speed = MathUtils.randRange(75, 150);

        if (!this.sprite.glTexture) {
            Game.renderer.spriteProgram.gl.bindTexture(Game.renderer.gl.TEXTURE_2D, null);
            Game.renderer.loadTexture(this.sprite);
        }
    }

    update(delta) {
        this.location.x += this.speed * delta * this.direction;

        if (
            this.location.x < -this.sprite.size.x * 0.5 ||
            this.location.x > Game.canvas.width + this.sprite.size.x * 0.5
        ) {
            this.destroy();
        }
    }

    draw(_gl, renderer, _delta) {
        if (!this.sprite.imageLoaded) return;

        const time = Game.renderer.time.currentTime + this.offsetTime;
        const frameData = this.sprite.getFrame(time, this.typeCol);
        const texCoords = this.sprite.getTexCoords(frameData);

        const vertices = buildQuadVertices(this.location, this.size, this.anchor ?? { x: 0, y: 0 });

        // Horizontal flip (swap left/right X values)
        if (this.direction === 1) {
            for (let i = 0; i < vertices.length; i += 2) {
                const cx = this.location.x;
                vertices[i] = cx * 2 - vertices[i];
            }
        }

        renderer.spriteProgram.draw(vertices, texCoords, this.sprite.glTexture);
    }

    GetFishType() {
        const keys = Object.keys(this.typeReference);
        return this.typeReference[keys[MathUtils.rangeRandInt(0, keys.length - 1)]];
    }

    onDestroy() {
        console.log("fish dead!");
    }
}

export { Fish };
