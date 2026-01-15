import { GlobalEvents } from "../events.js";
import { MathUtils, Vector2 } from "../math.js";
import { Line, Fish } from "../../entities/index.js";
import { Time } from "../time.js";
import { Game } from "../game.js";
import { Food } from "../../entities/food.js";
import { LineProgram } from "./programs/line_program.js";
import { SpriteProgram } from "./programs/sprite_program.js";
import { loadTexture } from "./glUtils.js";

const ASPECT_RATIO = {
    WIDTH: 1920,
    HEIGHT: 1080,
    PRESETS: {
        "1080p": [1920, 1080],
        "720p": [1280, 720],
        "900p": [1600, 900],
        "4:3": [1024, 768],
        "16:10": [1920, 1200],
        ultrawide: [2560, 1080],
    },
    SET(value) {
        const preset = this.PRESETS[value];
        if (!preset) return;

        this.WIDTH = preset[0];
        this.HEIGHT = preset[1];
        Game.renderer.onResize();
    },
};

window.ASPECT_RATIO = ASPECT_RATIO;

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
            this.spawnLineDelay = 1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
            if (Math.random() < 0.01) Game.entities.instances.push(new Fish());
        }
    }

    draw(delta) {
        const gl = this.gl;
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
            const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

            Game.spawn(Food, (f) => {
                const size = f.size;
                f.location = new Vector2(x - size.x / 2, y - size.y / 2);
            });
        }
    }
    onResize() {
        const dpr = window.devicePixelRatio || 1;
        const scale = Math.min(
            screen.width / ASPECT_RATIO.WIDTH,
            screen.height / ASPECT_RATIO.HEIGHT
        );

        this.canvas.width = Math.floor(ASPECT_RATIO.WIDTH * scale * dpr);
        this.canvas.height = Math.floor(ASPECT_RATIO.HEIGHT * scale * dpr);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}

function buildCanvas() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";

    const dpr = window.devicePixelRatio || 1;
    const scale = Math.min(screen.width / ASPECT_RATIO.WIDTH, screen.height / ASPECT_RATIO.HEIGHT);

    c.width = Math.floor(ASPECT_RATIO.WIDTH * scale * dpr);
    c.height = Math.floor(ASPECT_RATIO.HEIGHT * scale * dpr);

    document.body.insertBefore(c, document.body.firstChild);
    Game.canvas = c;
    return c;
}

export { Renderer };
