import { Entity } from "./entity.js";
import { Vector2 } from "../core/math.js";
import { Game, Assets } from "../core/game.js";
import { Sprite } from "../core/rendering/sprite.js";

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

        const x = this.location.x;
        const y = this.location.y;

        const vertices = [
            x,
            y,
            x + this.size.x,
            y,
            x,
            y + this.size.y,
            x + this.size.x,
            y,
            x,
            y + this.size.y,
            x + this.size.x,
            y + this.size.y,
        ];

        renderer.spriteProgram.draw(vertices, texCoords, this.sprite.glTexture);
    }
}

export { Food };
