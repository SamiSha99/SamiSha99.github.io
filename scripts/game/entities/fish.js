import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Game } from "../core/game.js";

class Fish extends Entity {
    type = "Fish";
    sprite = null;
    typeReference = {
        0: 0,
        1: 1,
        2: 2,
        3: 4,
    };
    typeCol = 0;
    size = new Vector2(128, 128);
    timePerFrame = 0.1;
    offsetTime = Math.random();

    constructor() {
        super();
        this.sprite = Game.entities.data.fish.sprite;
        this.direction = Math.random() < 0.5 ? -1 : 1;

        this.location = new Vector2(
            this.direction == -1 ? Game.canvas.width + this.sprite.size.x : -this.sprite.size.x,
            MathUtils.rangeRandInt(0, Game.canvas.height - this.sprite.size.y)
        );
        this.typeCol = this.GetFishType();
        const speedRange = Game.entities.data.fish.speed;
        this.speed = MathUtils.randRange(speedRange[0], speedRange[1]);
    }

    draw(ctx, _delta) {
        if (this.direction == 1) {
            ctx.save();
            ctx.translate(Game.canvas.width - (Game.canvas.width - this.location.x * 2), 0);
            ctx.scale(-1, 1);
        }
        const time = Game.drawer.time.currentTime;
        this.sprite.animate(ctx, time + this.offsetTime, this.location, undefined, this.typeCol);
        this.direction == 1 && ctx.restore();
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

    GetFishType() {
        return this.typeReference[
            MathUtils.rangeRandInt(0, Object.keys(this.typeReference).length - 1)
        ];
    }

    onDestroy() {}
}

export { Fish };
