import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../shared/index.js";
import { Game } from "../core/game.js";

class Snowflake extends Entity {
    type = "Snowflake";

    constructor(y) {
        super();
        // 0 is far away, 1 is close, closer flakes are bigger, faster and brighter.
        const depth = Math.random();
        this.radius = MathUtils.lerp(1.5, 4, depth);
        this.speed = MathUtils.lerp(30, 90, depth);
        this.alpha = MathUtils.lerp(0.25, 0.8, depth);
        this.color = this.getHueColor();

        // Side to side drift while falling.
        this.swayAmount = MathUtils.randRange(10, 30);
        this.swaySpeed = MathUtils.randRange(0.5, 1.5);
        this.swayOffset = Math.random() * Math.PI * 2;

        this.startX = MathUtils.randRange(0, Game.canvas.width);
        this.location = new Vector2(this.startX, y ?? -this.radius);
    }

    update(delta) {
        super.update(delta);
        const sway = Math.sin(this.lifeTime * this.swaySpeed + this.swayOffset) * this.swayAmount;
        this.location = new Vector2(this.startX + sway, this.location.y + this.speed * delta);

        if (this.location.y > Game.canvas.height + this.radius) {
            this.destroy();
        }

        this.color = this.getHueColor();
    }

    // Same hue and color as `--visited-link-color` in motion.css, white if the hue isn't animating.
    getHueColor() {
        if (!window.hue) return [248 / 255, 248 / 255, 255 / 255, this.alpha];
        const hue = (window.hue.time.currentTime + window.hue.offsetTime) % 360;
        return [...MathUtils.hslToRgb(hue, 1, 0.655), this.alpha];
    }

    draw(_gl, renderer, _delta) {
        renderer.programs.point.draw(this.location.x, this.location.y, this.radius * 2, this.color);
    }
}

export { Snowflake };

