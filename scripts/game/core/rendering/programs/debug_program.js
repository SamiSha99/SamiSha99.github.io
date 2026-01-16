import { Vector4 } from "../../math.js";
import { Program } from "./program.js";

export class DebugProgram extends Program {
    positionBuffer;
    a_position;
    u_resolution;
    u_color;

    defaultColor = new Vector4(1, 0, 0, 1);

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
        out vec4 outColor;
        uniform vec4 u_color;
        void main() {
            outColor = u_color;
        }`;

        super(gl, canvas, vs, fs);

        this.positionBuffer = gl.createBuffer();

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.u_resolution = gl.getUniformLocation(this.program, "u_resolution");
        this.u_color = gl.getUniformLocation(this.program, "u_color");

        // For labels, probably an alternative solution
        this.textCanvas = document.createElement("canvas");
        this.textCanvas.width = canvas.width;
        this.textCanvas.height = canvas.height;
        this.textCtx = this.textCanvas.getContext("2d");
        this.textCtx.font = "16px sans-serif";
        const l = this.defaultColor;
        this.textCtx.fillStyle = `rgba(${Math.round(l.x * 255)}, 
        ${Math.round(l.y * 255)}, 
        ${Math.round(l.z * 255)}, 
        ${l.w})`;
        this.textCtx.textBaseline = "top";

        this.textCanvas.style.position = "absolute";
        this.textCanvas.style.left = canvas.style.left;
        this.textCanvas.style.top = canvas.style.top;
        canvas.parentElement.appendChild(this.textCanvas);
    }

    draw(vertices, color = this.defaultColor) {
        const gl = this.gl;

        gl.useProgram(this.program);
        gl.uniform4f(this.u_color, color.x, color.y, color.z, color.w);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(this.a_position);
        gl.vertexAttribPointer(this.a_position, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(this.u_resolution, this.canvas.width, this.canvas.height);

        gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
    }

    drawBoundsFromVertices(vertices, color = this.defaultColor, label = null) {
        let minX = Infinity,
            minY = Infinity;
        let maxX = -Infinity,
            maxY = -Infinity;

        for (let i = 0; i < vertices.length; i += 2) {
            const x = vertices[i];
            const y = vertices[i + 1];
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        // Draw bounding box
        this.draw([minX, minY, maxX, minY, maxX, maxY, minX, maxY], color);

        // Draw label above top-left corner
        if (label) {
            const l = color;
            this.textCtx.fillStyle = `rgba(${Math.round(l.x * 255)}, 
            ${Math.round(l.y * 255)}, 
            ${Math.round(l.z * 255)}, 
            ${l.w})`;
            this.textCtx.fillText(label, minX + 2, minY - 18);
        }
    }

    clearText() {
        this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    }
}
