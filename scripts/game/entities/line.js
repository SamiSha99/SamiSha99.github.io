import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../core/math.js";
import { Game } from "../core/game.js";

class Line extends Entity {
    type = "Line";
    color = "rgba(248, 248, 255, 0.5)";
    length = 25;
    thickness = 2.5;

    constructor(speed, location, color = null) {
        super();
        this.direction = Math.random() < 0.5 ? -1 : 1;
        const speedRange = Game.entities.data.line.speed;
        this.startSpeed = MathUtils.randRange(speedRange[0], speedRange[1]);
        this.speed = this.startSpeed * this.direction;

        if (location != undefined) {
            this.location = location;
        } else {
            this.location = new Vector2(
                this.direction == -1 ? Game.canvas.width + this.length : -this.length,
                this.getY()
            );
        }

        if (color) {
            this.color = color;
        }
    }

    update(delta) {
        super.update(delta);
        const lineLength = this.length;
        this.location = this.location.add(this.speed * delta, 0);
        this.speed += this.startSpeed * delta * 0.4 * this.direction;
        if (this.location.x < -lineLength || this.location.x > Game.canvas.width + lineLength)
            this.destroy();
    }

    draw(ctx, _delta) {
        const lineThickness = this.thickness;
        const lineLength = this.length;
        ctx.lineWidth = lineThickness;

        ctx.beginPath();
        switch (this.direction) {
            case -1:
                ctx.moveTo(this.location.x, this.location.y);
                ctx.lineTo(this.location.subtract(lineLength).x, this.location.y);
                break;
            case 1:
                ctx.moveTo(this.location.add(lineLength).x, this.location.y);
                ctx.lineTo(this.location.x, this.location.y);
                break;
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    getY() {
        let maxLength = Game.canvas.height;
        let minLength = maxLength / 96;
        return MathUtils.randRange(minLength, maxLength);
    }

    onDestroy() {}
}

export { Line };
