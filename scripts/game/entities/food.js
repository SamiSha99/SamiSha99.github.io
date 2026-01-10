import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Game } from "../core/game.js";

class Food extends Entity {
    type = "Food";
    sprite = null;
    size = new Vector2(16, 16);
    timePerFrame = 0.1;
    offsetTime = Math.random();

    constructor({ x, y }) {
        super();
        this.sprite = Game.entities.data.food.sprite;
        this.location = new Vector2(x, y);
        this.speed = Game.entities.data.food.speed;
    }

    draw(ctx, _delta) {
        const time = Game.drawer.time.currentTime;
        this.sprite.animate(ctx, time + this.offsetTime, this.location, undefined, 0);
        this.direction == 1 && ctx.restore();
    }

    update(delta) {
        this.location.y += this.speed * delta;
        if (this.location.y > Game.canvas.height + this.sprite.size.y) this.destroy();
    }
}

export { Food };
