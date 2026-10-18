import { LineProgram } from "./line_program.js";
import { SpriteProgram } from "./sprite_program.js";
import { DebugProgram } from "./debug_program.js";
import { PointProgram } from "./point_program.js";

// Class containing all Programs we can use, simply call their draw() function
export class ProgramRegistery {
    /** @type {LineProgram} */
    line;
    /** @type {SpriteProgram} */
    sprite;
    /** @type {DebugProgram} */
    debug;
    /** @type {PointProgram} */
    point;

    constructor(gl, canvas) {
        this.line = new LineProgram(gl, canvas);
        this.sprite = new SpriteProgram(gl, canvas);
        this.debug = new DebugProgram(gl, canvas);
        this.point = new PointProgram(gl, canvas);
    }
}
