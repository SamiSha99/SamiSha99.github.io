import { GlobalEvents } from "../Events.js";
import { MathUtils, Vector2 } from "../math.js";
import { Line, Fish } from "../../entities/index.js";
import { Time } from "../Time.js";
import { Game } from "../Game.js";
import { Food } from "../../entities/Food.js";
import { LineProgram } from "./programs/LineProgram.js";
import { SpriteProgram } from "./programs/SpriteProgram.js";
import { loadTexture } from "./glUtils.js";

class Renderer extends GlobalEvents {
    /** @type {HTMLCanvasElement} */
    canvas;

    /** @type {WebGL2RenderingContext} */
    gl;

    time = null;

    constructor(canvas) {
        super();
        this.time = new Time();
        this.time.update = this.update.bind(this);

        this.canvas = canvas ?? buildCanvas();
        this.gl = this.canvas.getContext("webgl2", {
            alpha: true,
            antialias: true,
        });

        if (!this.gl) throw new Error("WebGL2 not supported");

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // Programs
        this.lineProgram = new LineProgram(this.gl, this.canvas);
        this.spriteProgram = new SpriteProgram(this.gl, this.canvas);
    }

    run() {
        Game.renderer = this;
        Game.state.isInitialized = true;
    }

    loadTexture(sprite) {
        return loadTexture(this.gl, sprite);
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
            const spawnRate = [10, 20];
            this.spawnLineDelay =
                1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
            if (Math.random() < 0.01) Game.entities.instances.push(new Fish());
        }
    }

    draw(delta) {
        const gl = this.gl;
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let entity of Game.entities.instances) {
            if (entity.type === "Line" && typeof entity.draw === "function") {
                entity.draw(gl, this, delta);
            }
        }

        for (let entity of Game.entities.instances) {
            if (entity.type !== "Line" && typeof entity.draw === "function") {
                entity.draw(gl, this, delta);
            }
        }
    }

    onClick(e) {
        if (e.type === "click" && Game.entities.getAll(Food).length < 10) {
            const rect = this.canvas.getBoundingClientRect();
            const x =
                (e.clientX - rect.left) * (this.canvas.width / rect.width);
            const y =
                (e.clientY - rect.top) * (this.canvas.height / rect.height);

            Game.spawn(Food, (f) => {
                const size = f.size;
                f.location = new Vector2(x - size.x / 2, y - size.y / 2);
            });
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

export { Renderer };
