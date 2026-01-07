import { GlobalEvents } from "./globalevents.js";
import { Vector2, MathUtils } from "./math.js";
import { game } from "./properties.js";

class Entity extends GlobalEvents {
    lifeTime = 0;
    lifespan = Infinity;
    /** @type {Vector2} */
    location = new Vector2();
    constructor(lifespan) {
        super();
        lifespan !== undefined && (this.lifespan = lifespan);
    }
    start() {}
    draw(ctx, delta) {}
    update(delta) {
        this.lifeTime += delta;
        if (this.lifeTime >= this.lifespan) {
            // remove entity
            const index = game.entities.instances.indexOf(this);
            if (index > -1) game.entities.instances.splice(index, 1);
        }
    }
}

class Fish extends Entity {
    type = "Fish";
    static sprite = window.game.assetFolder + "/images/fish/smallswim.png";
    typeReference = {
        0: 0,
        1: 1,
        2: 2,
        // pirahna fish sprite row
        3: 4,
    };
    spriteWidth = 128;
    spriteHeight = 128;

    constructor(name, type = null) {
        this.name = name;
        direction = Math.random() < 0.5 ? "left" : "right";
        this.location = new Vector2(
            direction == "left" ? canvas.width + lineLength : -lineLength,
            MathUtils.rangeRandInt(0, canvas.height - this.spriteHeight)
        );
        this.type = type ?? this.GetFishType();
    }

    draw(ctx, _delta) {
        if (this.direction == "right") {
            ctx.save();
            ctx.translate(
                canvas.width - (canvas.width - this.location.x * 2),
                0
            );
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            // Sprite sheet
            this.sprite.image,
            // The sprite frame to draw
            Math.max(0, Math.round((this.time % 1) / this.frameTime) - 1) *
                this.spriteWidth,
            this.type * this.spriteHeight,
            // Size of the sprite frame
            this.spriteWidth,
            this.spriteHeight,
            // location of the sprite frame
            this.location.x,
            this.location.y,
            // size on the canvas
            this.sprite.size,
            this.sprite.size
        );
        this.direction == "right" && ctx.restore();
    }
    GetFishType() {
        return this.typeReference[
            MathUtils.rangeRandInt(
                0,
                Object.keys(this.typeReference).length - 1
            )
        ];
    }
}

class Line extends Entity {
    type = "Line";
    color = "rgba(248, 248, 255, 0.5)";
    length = 25;
    thickness = 2.5;
    constructor(speed, location, color = null) {
        super();
        this.direction = Math.random() < 0.5 ? -1 : 1;
        const speedRange = window.game.entities.data.line.speed;
        this.startSpeed = MathUtils.randRange(speedRange[0], speedRange[1]);
        this.speed = this.startSpeed * this.direction;
        /** @type {Vector2} */
        if (location != undefined) {
            this.location = location;
        } else {
            this.location = new Vector2(
                this.direction == -1 ? game.canvas.width + this.length : -this.length,
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
        if (
            this.location.x < -lineLength ||
            this.location.x > window.game.canvas.width + lineLength
        ) {
            const index = game.entities.instances.indexOf(this);
            if (index > -1) game.entities.instances.splice(index, 1);
            this.destroy();
        }
    }

    draw(ctx, delta) {
        const lineThickness = this.thickness;
        const lineLength = this.length;
        /** @type {CanvasRenderingContext2D}*/
        ctx.lineWidth = lineThickness;

        ctx.beginPath();
        switch (this.direction) {
            case -1:
                ctx.moveTo(this.location.x, this.location.y);
                ctx.lineTo(
                    this.location.subtract(lineLength).x,
                    this.location.y
                );
                break;
            case 1:
                ctx.moveTo(this.location.add(lineLength).x, this.location.y);
                ctx.lineTo(this.location.x, this.location.y);
                break;
        }
        // apply gradient
        ctx.strokeStyle = this.color;
        // end
        ctx.stroke();
    }

    getY() {
        let maxLength = window.game.canvas.height;
        let minLength = maxLength / 96;
        return MathUtils.randRange(minLength, maxLength);
    }

    onDestroy() {
        console.log("Line destroyed");
    }
}

export { Entity, Fish, Line };
