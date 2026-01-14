import { Program } from "./Program.js";

export class LineProgram extends Program {
    positionBuffer;
    a_position;
    u_resolution;
    u_color;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {HTMLCanvasElement} canvas
     */
    constructor(gl, canvas) {
        const vs = `#version 300 es
        in vec2 a_position;
        uniform vec2 u_resolution;
        void main() {
            vec2 zeroToOne = a_position / u_resolution;
            vec2 clip = zeroToOne * 2.0 - 1.0;
            gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
        }`;

        const fs = `#version 300 es
        precision mediump float;
        uniform vec4 u_color;
        out vec4 outColor;
        void main() {
            outColor = u_color;
        }`;

        super(gl, canvas, vs, fs);

        this.positionBuffer = gl.createBuffer();

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.u_resolution = gl.getUniformLocation(this.program, "u_resolution");
        this.u_color = gl.getUniformLocation(this.program, "u_color");
    }

    draw(vertices, color, thickness = 1) {
        const gl = this.gl;
        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.DYNAMIC_DRAW
        );

        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u_resolution, this.canvas.width, this.canvas.height);
        gl.uniform4fv(this.u_color, color);

        gl.lineWidth(thickness); // mostly ignored in browsers
        gl.drawArrays(gl.LINES, 0, vertices.length / 2);
    }
}
