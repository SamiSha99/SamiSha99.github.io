import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../shared/index.js";
import { Game } from "../core/game.js";

const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    frame: undefined,
    active: false,
};

window.addEventListener("pointermove", (e) => {
    const canvas = Game.canvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (!mouse.active) {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
    }
    mouse.active = true;
});

document.addEventListener("pointerleave", () => (mouse.active = false));

function sampleMouse(delta) {
    const frame = Game.renderer?.time.currentRealTime;
    if (delta > 0 && frame === mouse.frame) return;
    mouse.frame = frame;
    mouse.vx = delta > 0 ? (mouse.x - mouse.prevX) / delta : 0;
    mouse.vy = delta > 0 ? (mouse.y - mouse.prevY) / delta : 0;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
}

class Snowflake extends Entity {
    type = "Snowflake";

    static max = 1500;
    static mouseRadius = 160;
    static mouseStrength = 4;
    static pushDrag = 3;
    pushX = 0;
    pushY = 0;
    static rainbowDuration = 2.5;
    static rainbowSpeed = 360;
    rainbow = 0;
    rainbowHue = Math.random() * 360;

    constructor(y) {
        super();
        // 0 is far away, 1 is close, closer flakes are bigger, faster and brighter.
        const depth = Math.random();
        this.radius = MathUtils.lerp(1.5, 4, depth);
        this.speed = MathUtils.lerp(30, 90, depth);
        this.alpha = MathUtils.lerp(0.25, 0.8, depth);
        this.color = this.getColor();

        // Side to side drift while falling.
        this.swayAmount = MathUtils.randRange(10, 30);
        this.swaySpeed = MathUtils.randRange(0.5, 1.5);
        this.swayOffset = Math.random() * Math.PI * 2;

        this.startX = MathUtils.randRange(0, Game.canvas.width);
        this.location = new Vector2(this.startX, y ?? -this.radius);
    }

    update(delta) {
        super.update(delta);
        this.pushByMouse(delta);
        this.startX += this.pushX * delta;

        const sway = Math.sin(this.lifeTime * this.swaySpeed + this.swayOffset) * this.swayAmount;
        this.location = new Vector2(
            this.startX + sway,
            this.location.y + (this.speed + this.pushY) * delta,
        );

        if (this.location.y > Game.canvas.height + this.radius) {
            this.destroy();
        }

        this.rainbow = Math.max(0, this.rainbow - delta / Snowflake.rainbowDuration);
        this.color = this.getColor();
    }

    getColor() {
        const color = this.getHueColor();
        if (this.rainbow <= 0) return color;
        const t = this.rainbow * this.rainbow * (3 - 2 * this.rainbow);
        const hue = (this.rainbowHue + this.lifeTime * Snowflake.rainbowSpeed) % 360;
        const rainbow = MathUtils.hslToRgb(hue, 1, 0.655);
        return [
            MathUtils.lerp(color[0], rainbow[0], t),
            MathUtils.lerp(color[1], rainbow[1], t),
            MathUtils.lerp(color[2], rainbow[2], t),
            this.alpha,
        ];
    }

    pushByMouse(delta) {
        sampleMouse(delta);
        const moving = mouse.active && (mouse.vx !== 0 || mouse.vy !== 0);
        if (moving) {
            const distance = Math.hypot(this.location.x - mouse.x, this.location.y - mouse.y);
            if (distance < Snowflake.mouseRadius) {
                const falloff = 1 - distance / Snowflake.mouseRadius;
                this.pushX += mouse.vx * falloff * Snowflake.mouseStrength * delta;
                this.pushY += mouse.vy * falloff * Snowflake.mouseStrength * delta;
                this.rainbow = Math.min(1, this.rainbow + falloff * delta * 16);
            }
        }
        const drag = Math.exp(-Snowflake.pushDrag * delta);
        this.pushX *= drag;
        this.pushY *= drag;
    }

    // Same as the site hue color, white if the hue isn't animating.
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

