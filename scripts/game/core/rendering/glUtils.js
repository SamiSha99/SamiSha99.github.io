import { Vector2 } from "../math.js";

export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

export function createProgram(gl, vsSource, fsSource) {
    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
}

export function buildQuadVertices(pos, size, anchor = new Vector2(0, 0)) {
    const hw = size.x * 0.5;
    const hh = size.y * 0.5;

    const cx = pos.x - anchor.x * hw;
    const cy = pos.y - anchor.y * hh;

    return [
        cx - hw,
        cy - hh,
        cx + hw,
        cy - hh,
        cx - hw,
        cy + hh,

        cx + hw,
        cy - hh,
        cx - hw,
        cy + hh,
        cx + hw,
        cy + hh,
    ];
}
