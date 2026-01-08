import { GlobalEvents } from "../core/events.js";
import { MathUtils } from "../core/math.js";
import { Line, Fish } from "../entities/index.js";
import { Time } from "../core/time.js";
import { Game } from "../config/game-config.js";

class Drawer extends GlobalEvents {
    canvas;
    ctx;
    time = null;

    constructor(canvas) {
        super();
        this.time = new Time();
        this.time.update = this.update.bind(this);

        if (!canvas) {
            this.canvas = buildCanvas();
        } else {
            this.canvas = canvas;
        }
        this.ctx = this.canvas.getContext("2d");
    }

    run() {
        Game.drawer = this;
        Game.state.isInitialized = true;
    }

    spawnLineDelay = 0;

    update(delta) {
        this.draw(delta);
        for (let entity of Game.entities.instances) {
            if (typeof entity.update === "function") entity.update(delta);
        }

        this.spawnLineDelay -= delta;
        if (this.spawnLineDelay <= 0) {
            Game.entities.instances.push(new Line());

            const spawnRate = Game.entities.data.line.spawnAmount;
            this.spawnLineDelay = 1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
            if (Math.random() < 0.01) {
                Game.entities.instances.push(new Fish());
            }
        }
    }

    draw(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let entity of Game.entities.instances) {
            if (typeof entity.draw === "function") entity.draw(this.ctx, delta);
        }
    }

    static clearCanvas() {
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    }

    static drawLine(line) {
        Game.ctx.strokeStyle = line.color;
        Game.ctx.lineWidth = Game.entities.data.line.thickness;
        Game.ctx.beginPath();
        if (line.direction === "right") {
            Game.ctx.moveTo(line.location, line.offset);
            Game.ctx.lineTo(line.location - Game.entities.data.line.length, line.offset);
        } else {
            Game.ctx.moveTo(line.location, line.offset);
            Game.ctx.lineTo(line.location + Game.entities.data.line.length, line.offset);
        }
    }
}

function buildCanvas() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";
    c.width = Math.max(document.body.clientWidth, 0);
    c.height = Math.max(screen.height, window.innerHeight, 0);
    document.body.insertBefore(c, document.body.firstChild);
    Game.canvas = c;
    return c;
}

export { Drawer, buildCanvas };
