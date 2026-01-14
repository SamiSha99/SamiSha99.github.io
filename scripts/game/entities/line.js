import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Game } from "../core/game.js";

class Line extends Entity {
    type = "Line";

    // normalized RGBA for WebGL
    color = [248 / 255, 248 / 255, 255 / 255, 0.5];

    length = 25;
    thickness = 2.5;

    constructor(speed, location, color = null) {
        super();

        this.direction = Math.random() < 0.5 ? -1 : 1;

        const speedRange = [75, 150];
        this.startSpeed = MathUtils.randRange(speedRange[0], speedRange[1]);
        this.speed = this.startSpeed * this.direction;

        this.location =
            location ??
            new Vector2(
                this.direction === -1
                    ? Game.canvas.width + this.length
                    : -this.length,
                this.getY()
            );

        if (color) {
            this.color = color;
        }
    }

    update(delta) {
        super.update(delta);

        this.location = this.location.add(this.speed * delta, 0);
        this.speed += this.startSpeed * delta * 0.4 * this.direction;

        const limit = this.length;
        if (
            this.location.x < -limit ||
            this.location.x > Game.canvas.width + limit
        ) {
            this.destroy();
        }
    }

    draw(gl, drawer, _delta) {
        const x = this.location.x;
        const y = this.location.y;
        const len = this.length;

        let vertices;

        if (this.direction === -1) {
            vertices = [x, y, x - len, y];
        } else {
            vertices = [x + len, y, x, y];
        }

        drawer.drawLine(vertices, this.thickness, this.color);
    }

    getY() {
        const max = Game.canvas.height;
        const min = max / 96;
        return MathUtils.randRange(min, max);
    }

    onDestroy() {}
}

export { Line };
