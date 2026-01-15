import { Entity } from "./entity.js";
import { Vector2 } from "../core/math.js";
import { Game, Assets } from "../core/game.js";
import { Sprite } from "../core/rendering/sprite.js";
import { buildQuadVertices } from "../core/rendering/glUtils.js";

class Food extends Entity {
    size = new Vector2(48, 48);
    speed = 75;

    sprite = new Sprite({
        name: "Food",
        size: this.size,
        imagePath: Assets.get("images/fish/food.png"),
        cols: 10,
        rows: 5,
        frameTime: 0.1,
    });

    offsetTime = Math.random();

    constructor() {
        super();
        console.log(this.sprite);
        if (!this.sprite.glTexture) {
            Game.renderer.spriteProgram.gl.bindTexture(Game.renderer.gl.TEXTURE_2D, null);
            Game.renderer.loadTexture(this.sprite);
        }
    }

    update(delta) {
        this.location.y += this.speed * delta;

        if (this.location.y > Game.canvas.height + this.sprite.size.y) {
            this.destroy();
        }
    }

    draw(_gl, renderer, _delta) {
        if (!this.sprite.imageLoaded) return;

        const time = Game.renderer.time.currentTime + this.offsetTime;
        const frameData = this.sprite.getFrame(time, 0);
        const texCoords = this.sprite.getTexCoords(frameData);

        const vertices = buildQuadVertices(this.location, this.size, this.sprite?.anchor);

        // Horizontal flip (swap left/right X values)
        if (this.direction === 1) {
            for (let i = 0; i < vertices.length; i += 2) {
                const cx = this.location.x;
                vertices[i] = cx * 2 - vertices[i];
            }
        }

        renderer.spriteProgram.draw(vertices, texCoords, this.sprite.glTexture);
    }
}

export { Food };
