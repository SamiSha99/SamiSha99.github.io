import { MathUtils, Vector2 } from "./math.js";
import { GlobalEvents } from "./globalevents.js";
import { Line, Fish } from "./entities.js";
import { game } from "./properties.js";

class Sprite {
    constructor(
        name,
        imagePath,
        frameWidth,
        frameHeight,
        cols,
        rows,
        size,
        frameTime
    ) {
        this.image = new Image();
        this.name = name ?? "Unnamed Sprite";
        this.image.src = imagePath;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.cols = cols;
        this.rows = rows;
        this.size = size;
        this.frameTime = frameTime;
    }
}

class Time extends GlobalEvents {
    currentTime = 0;
    // Time dilation with pause implementation
    prevTime = performance.now();
    worldDilation = 1;
    update;
    constructor() {
        super();
        requestAnimationFrame(this.loop.bind(this));
    }

    getDelta() {
        if (game.state.isPaused) {
            this.prevTime = undefined;
            return 0;
        }

        const currentTime = performance.now();
        if (this.prevTime === undefined) {
            this.prevTime = currentTime;
            return 0;
        }
        const deltaTime = (currentTime - this.prevTime) * this.worldDilation;
        this.prevTime = currentTime;
        return deltaTime / 1000;
    }

    loop() {
        let delta = this.getDelta();
        this.currentTime += delta;
        this.update(delta);
        requestAnimationFrame(this.loop.bind(this));
    }
    onFocus() {
        this.prevTime = undefined;
        game.state.isPaused = false;
    }
    onBlur() {
        this.prevTime = undefined;
        game.state.isPaused = true;
    }
}

class Drawer extends GlobalEvents {
    /**@type {HTMLCanvasElement} - canvas */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
    time = new Time();
    constructor(canvas) {
        super();
        this.time.update = this.update.bind(this);
        if (!canvas) {
            this.canvas = document.createElement("canvas");
        } else this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
    }

    spawnLineDelay = 0;
    update(delta) {
        this.draw(delta);
        for (let entity of game.entities.instances) {
            if (typeof entity.update === "function") entity.update(delta);
        }

        this.spawnLineDelay -= delta;
        console.log("Presnet Entities:", game.entities.instances.length);
        if (this.spawnLineDelay <= 0) {
            game.entities.instances.push(new Line());

            const spawnRate = game.entities.data.line.spawnAmount;
            this.spawnLineDelay =
                1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
            if (Math.random() < 0.01) {
                // AddFish();
                console.log("Spawn fish! :3");
            }
        }
    }

    draw(delta) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let entity of game.entities.instances) {
            if (typeof entity.draw === "function") entity.draw(this.ctx, delta);
        }
    }

    static clearCanvas() {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    }
    static drawLine(line) {
        game.ctx.strokeStyle = line.color;
        game.ctx.lineWidth = game.entities.data.line.thickness;
        game.ctx.beginPath();
        if (line.direction === "right") {
            game.ctx.moveTo(line.location, line.offset);
            game.ctx.lineTo(
                line.location - game.entities.data.line.length,
                line.offset
            );
        } else {
            game.ctx.moveTo(line.location, line.offset);
            game.ctx.lineTo(
                line.location + game.entities.data.line.length,
                line.offset
            );
        }
    }
}

function main() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";
    c.width = Math.max(document.body.clientWidth, 0);
    c.height = Math.max(screen.height, window.innerHeight, 0);
    document.body.insertBefore(c, document.body.firstChild);
    game.canvas = c;
    game.drawer = new Drawer(c);
    game.state.isInitialized = true;
}
main();
