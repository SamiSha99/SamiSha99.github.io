import { GlobalEvents } from "../core/events.js";
import { MathUtils } from "../core/math.js";
import { Line, Fish } from "../entities/index.js";
import { Time } from "../core/time.js";
import { Game } from "../config/game-config.js";
import { Food } from "../entities/food.js";

class Drawer extends GlobalEvents {
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} - ctx */
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
        this.ctx.fillStyle = "rgba(0,0,0,0)";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let entity of Game.entities.instances) {
            if (entity.type === "Line" && typeof entity.draw === "function") {
                entity.draw(this.ctx, delta);
            }
        }

        for (let entity of Game.entities.instances) {
            if (entity.type !== "Line" && typeof entity.draw === "function") {
                entity.draw(this.ctx, delta);
            }
        }
    }

    static clearCanvas() {
        this.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    }

    onClick(e) {
        if (
            e.type === "click" &&
            Game.entities.instances.filter((i) => i.type == "Food").length < 10
        ) {
            const rect = this.canvas.getBoundingClientRect();

            const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
            const size = Game.entities.data.food.sprite.size;
            const food = new Food({ x: x - size.x / 2, y: y - size.y / 2 });
            Game.entities.instances.push(food);
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
