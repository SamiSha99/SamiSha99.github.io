import { GlobalEvents } from "../events.js";
import { MathUtils, Vector2 } from "../math.js";
import { Line, Fish } from "../../entities/index.js";
import { Time } from "../time.js";
import { Game } from "../game.js";
import { Food } from "../../entities/food.js";

class Drawer extends GlobalEvents {
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

        if (!this.gl) {
            throw new Error("WebGL2 not supported");
        }

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.initGL();
        this.initSpriteGL();
    }

    /** ---------------- LINE SHADER ---------------- */
    initGL() {
        const gl = this.gl;

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

        this.program = createProgram(gl, vs, fs);
        this.positionBuffer = gl.createBuffer();

        this.a_position = gl.getAttribLocation(this.program, "a_position");
        this.u_resolution = gl.getUniformLocation(this.program, "u_resolution");
        this.u_color = gl.getUniformLocation(this.program, "u_color");
    }

    /** ---------------- SPRITE SHADER ---------------- */
    initSpriteGL() {
        const gl = this.gl;

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

        this.spriteProgram = createProgram(gl, vs, fs);
        this.spritePositionBuffer = gl.createBuffer();
        this.spriteTexCoordBuffer = gl.createBuffer();

        this.a_position_sprite = gl.getAttribLocation(
            this.spriteProgram,
            "a_position"
        );
        this.a_texCoord_sprite = gl.getAttribLocation(
            this.spriteProgram,
            "a_texCoord"
        );
        this.u_resolution_sprite = gl.getUniformLocation(
            this.spriteProgram,
            "u_resolution"
        );
        this.u_texture = gl.getUniformLocation(this.spriteProgram, "u_texture");
    }

    /** ---------------- RUN / UPDATE ---------------- */
    run() {
        Game.drawer = this;
        Game.state.isInitialized = true;
    }

    spawnLineDelay = 0;

    update(delta) {
        this.draw(delta);

        for (let entity of Game.entities.instances) {
            if (typeof entity.update === "function") {
                entity.update(delta);
            }
        }

        this.spawnLineDelay -= delta;
        if (this.spawnLineDelay <= 0) {
            Game.entities.instances.push(new Line());

            const spawnRate = [10, 20];
            this.spawnLineDelay =
                1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);

            if (Math.random() < 0.01) {
                Game.entities.instances.push(new Fish());
            }
        }
    }

    /** ---------------- DRAW ---------------- */
    draw(delta) {
        const gl = this.gl;

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw lines first
        for (let entity of Game.entities.instances) {
            if (entity.type === "Line" && typeof entity.draw === "function") {
                entity.draw(gl, this, delta);
            }
        }

        // Draw sprites (Fish etc.)
        for (let entity of Game.entities.instances) {
            if (entity.type !== "Line" && typeof entity.draw === "function") {
                entity.draw(gl, this, delta);
            }
        }
    }

    /** ---------------- LINE DRAW ---------------- */
    drawLine(vertices, thickness, color) {
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

        gl.lineWidth(thickness); // limited to 1 on most platforms
        gl.drawArrays(gl.LINES, 0, vertices.length / 2);
    }

    /** ---------------- SPRITE TEXTURE LOADING ---------------- */
    loadTexture(sprite) {
        const gl = this.gl;
        const img = sprite.image;

        if (!img.complete) {
            img.onload = () => this.loadTexture(sprite);
            return;
        }

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);

        // Prevent premultiplied alpha issues
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        // Texture wrapping
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Texture filtering
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        // Upload image to GPU
        gl.texImage2D(
            gl.TEXTURE_2D,
            0, // mip level
            gl.RGBA, // internal format
            gl.RGBA, // source format
            gl.UNSIGNED_BYTE,
            img
        );

        sprite.glTexture = tex;
    }

    /** ---------------- SPRITE DRAW ---------------- */
    drawSprite(vertices, texCoords, texture) {
        const gl = this.gl;

        gl.useProgram(this.spriteProgram);

        // Vertex positions in pixels
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spritePositionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.DYNAMIC_DRAW
        );
        gl.enableVertexAttribArray(this.a_position_sprite);
        gl.vertexAttribPointer(
            this.a_position_sprite,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Texture coordinates normalized [0,1]
        gl.bindBuffer(gl.ARRAY_BUFFER, this.spriteTexCoordBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(texCoords),
            gl.DYNAMIC_DRAW
        );
        gl.enableVertexAttribArray(this.a_texCoord_sprite);
        gl.vertexAttribPointer(
            this.a_texCoord_sprite,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Canvas resolution for pixel-to-clip conversion
        gl.uniform2f(
            this.u_resolution_sprite,
            this.canvas.width,
            this.canvas.height
        );

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(this.u_texture, 0);

        // Draw triangles
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
    }

    /** ---------------- CLICK ---------------- */
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

/** ---------------- CANVAS BUILDER ---------------- */
function buildCanvas() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";
    c.width = Math.max(document.body.clientWidth, 0);
    c.height = Math.max(screen.height, window.innerHeight, 0);
    document.body.insertBefore(c, document.body.firstChild);
    Game.canvas = c;
    return c;
}

/** ---------------- HELPERS ---------------- */
function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);

    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s));
    }
    return s;
}

function createProgram(gl, vsSource, fsSource) {
    const p = gl.createProgram();
    gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(p);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p));
    }
    return p;
}

export { Drawer, buildCanvas };
