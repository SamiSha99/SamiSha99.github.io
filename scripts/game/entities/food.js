import { Entity } from "./entity.js";
import { Vector2 } from "../core/math.js";
import { Game, Assets } from "../core/game.js";
import { Sprite } from "../rendering/sprite.js";

class Food extends Entity {
    size = new Vector2(48, 48);
    speed = 75;
    sprite = new Sprite({
        name: this.type,
        size: this.size,
        imagePath: Assets.get("images/fish/food.png"),
        cols: 10,
        rows: 5,
    });
    timePerFrame = 0.1;
    offsetTime = Math.random();

    draw(ctx, _delta) {
        const time = Game.drawer.time.currentTime;
        this.sprite.animate(
            ctx,
            time + this.offsetTime,
            this.location,
            undefined,
            0
        );
        this.direction == 1 && ctx.restore();
    }

    update(delta) {
        this.location.y += this.speed * delta;
        if (this.location.y > Game.canvas.height + this.sprite.size.y)
            this.destroy();
    }
}

export { Food };
