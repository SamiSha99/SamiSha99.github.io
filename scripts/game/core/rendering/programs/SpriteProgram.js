import { createProgram } from "../glUtils.js";
import { Program } from "./Program.js";

export class SpriteProgram extends Program {
    positionBuffer;
    texCoordBuffer;
    a_position;
    a_texCoord;
    u_resolution;
    u_texture;

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {HTMLCanvasElement} canvas
     */
    constructor(gl, canvas) {
        const vs = `#version 300 es
        in vec2 a_position;
        in vec2 a_texCoord;
        uniform vec2 u_resolution;
        out vec2 v_texCoord;
        void main() {
            vec2 zeroToOne = a_position / u_resolution;
            vec2 clip = zeroToOne * 2.0 - 1.0;
            gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
            v_texCoord = a_texCoord;
            }`;

        const fs = `#version 300 es
            precision mediump float;
        in vec2 v_texCoord;
        uniform sampler2D u_texture;
        out vec4 outColor;
        void main() {
            outColor = texture(u_texture, v_texCoord);
            }`;

        super(gl, canvas, vs, fs);
        this.positionBuffer = gl.createBuffer();
        this.texCoordBuffer = gl.createBuffer();

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.a_texCoord = gl.getAttribLocation(this.program, "a_texCoord");
        this.u_resolution = gl.getUniformLocation(this.program, "u_resolution");
        this.u_texture = gl.getUniformLocation(this.program, "u_texture");
    }

    draw(vertices, texCoords, texture) {
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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(texCoords),
            gl.DYNAMIC_DRAW
        );
        gl.enableVertexAttribArray(this.a_texCoord);
        gl.vertexAttribPointer(this.a_texCoord, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u_resolution, this.canvas.width, this.canvas.height);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.u_texture, 0);

        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }
}
