import { createProgram } from "../glUtils.js";

class Program {
    /** @type {WebGL2RenderingContext} */
    gl;
    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {WebGLProgram} */
    program;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {HTMLCanvasElement} canvas
     * @param {any} vs
     * @param {any} fs
     */
    constructor(gl, canvas, vs, fs) {
        this.gl = gl;
        this.canvas = canvas;
        this.program = createProgram(gl, vs, fs);
    }

    // draw() {}
}

export { Program };
