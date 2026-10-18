import { Program } from "./program.js";

// Soft round dots, `size` is the diameter in canvas pixels.
export class PointProgram extends Program {
    positionBuffer;
    a_position;
    u_resolution;
    u_size;
    u_color;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {HTMLCanvasElement} canvas
     */
    constructor(gl, canvas) {
        const vs = `#version 300 es
        in vec2 a_position;
        uniform vec2 u_resolution;
        uniform float u_size;
        void main() {
            vec2 zeroToOne = a_position / u_resolution;
            vec2 clip = zeroToOne * 2.0 - 1.0;
            gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
            gl_PointSize = u_size;
        }`;

        // Fades out towards the edge of the point instead of a hard square.
        const fs = `#version 300 es
        precision mediump float;
        uniform vec4 u_color;
        out vec4 outColor;
        void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            outColor = vec4(u_color.rgb, u_color.a * (1.0 - smoothstep(0.4, 1.0, d)));
        }`;

        super(gl, canvas, vs, fs);

        this.positionBuffer = gl.createBuffer();

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.u_resolution = gl.getUniformLocation(this.program, "u_resolution");
        this.u_size = gl.getUniformLocation(this.program, "u_size");
        this.u_color = gl.getUniformLocation(this.program, "u_color");
    }

    draw(x, y, size, color) {
        const gl = this.gl;
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y]), gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u_resolution, this.canvas.width, this.canvas.height);
        gl.uniform1f(this.u_size, size);
        gl.uniform4fv(this.u_color, color);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
