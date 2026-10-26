import { GlobalEvents } from "../events.js";
import { Game } from "../game.js";
import { ProgramRegistery } from "./programs/index.js";

const ASPECT_RATIO = {
    WIDTH: 1920,
    HEIGHT: 1080,
    SELECTED_PRESET: "1080p",
    PRESETS: {
        "1080p": [1920, 1080],
        "720p": [1280, 720],
        "900p": [1600, 900],
        "4:3": [1024, 768],
        "16:10": [1920, 1200],
        ultrawide: [2560, 1080],
        custom: [-1, -1], // uses innerWidth/innerHeight for this one instead.
    },
    SET(value) {
        const preset = this.PRESETS[value];
        if (!preset) return;

        this.WIDTH = preset[0];
        this.HEIGHT = preset[1];
        this.SELECTED_PRESET = value;
        Game.instance?.renderer.onResize();
    },
    GET(key) {
        return this.PRESETS[key] ?? [-1, -1];
    },
    GET_NAME(index) {
        return Object.keys(this.PRESETS)[index];
    },
};

window.ASPECT_RATIO = ASPECT_RATIO;

class Renderer extends GlobalEvents {
    /** @type {HTMLCanvasElement} */
    canvas;

    /** @type {WebGL2RenderingContext} */
    gl;

    /** @type {ProgramRegistery} */
    programs;

    constructor(resolutionMode) {
        super();
        if (resolutionMode) ASPECT_RATIO.SET(resolutionMode);
        this.canvas = buildCanvas();
        this.gl = this.canvas.getContext("webgl2", {
            alpha: true,
            antialias: true,
        });

        if (!this.gl) throw new Error("WebGL2 not supported");

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.programs = new ProgramRegistery(this.gl, this.canvas);
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
        resizeCanvas(this.canvas);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
}

function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;

    if (ASPECT_RATIO.SELECTED_PRESET === "custom") {
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        return;
    }

    const scale = Math.min(screen.width / ASPECT_RATIO.WIDTH, screen.height / ASPECT_RATIO.HEIGHT);
    canvas.width = Math.floor(ASPECT_RATIO.WIDTH * scale * dpr);
    canvas.height = Math.floor(ASPECT_RATIO.HEIGHT * scale * dpr);
}

function buildCanvas() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";

    resizeCanvas(c);

    document.body.insertBefore(c, document.body.firstChild);
    Game.canvas = c;
    return c;
}

export { Renderer };
