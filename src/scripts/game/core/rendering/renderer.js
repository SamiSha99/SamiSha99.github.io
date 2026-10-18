import { Snowflake } from "../../entities/index.js";
import { MathUtils, Vector2 } from "../../shared/index.js";
import { Time } from "../../shared/time.js";
import { GlobalEvents } from "../events.js";
import { Game } from "../game.js";
import { ProgramRegistery } from "./programs/index.js";

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
    /** @type {ProgramRegistery} */
    programs;

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

        this.programs = new ProgramRegistery(this.gl, this.canvas);
    }

    run() {
        Game.renderer = this;
        Game.state.isInitialized = true;
        // Start with it already spawning
        for (let i = 0; i < 150; i++) {
            Game.entities.add(new Snowflake(MathUtils.randRange(0, this.canvas.height)));
        }
    }

    spawnSnowDelay = 0;

    update(delta) {
        this.draw(delta);

        for (let entity of Game.entities.instances) {
            if (typeof entity.update === "function") entity.update(delta);
        }

        this.spawnSnowDelay -= delta;
        if (this.spawnSnowDelay <= 0) {
            Game.entities.add(new Snowflake());
            const spawnRate = [6, 12];
            this.spawnSnowDelay = 1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
        }
    }

    draw(delta) {
        const gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // Workaround for now, to-do: Debug class?
        this.programs.debug.clearText();

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

    onResize() {
        const dpr = window.devicePixelRatio || 1;
        const scale = Math.min(
            screen.width / ASPECT_RATIO.WIDTH,
            screen.height / ASPECT_RATIO.HEIGHT,
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

