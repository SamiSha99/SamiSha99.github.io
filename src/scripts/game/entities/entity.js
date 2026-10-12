import { Game } from "../core/game.js";
import { GlobalEvents } from "../core/events.js";
import { Sprite } from "../core/rendering/sprite.js";
import { Renderer } from "../core/rendering/renderer.js";
import { Vector2 } from "../shared/index.js";

class Entity extends GlobalEvents {
    location = new Vector2();
    size = new Vector2(32, 32);
    speed = 100;
    /** @type {Sprite} */
    sprite = null;
    lifeTime = 0;
    lifespan = Infinity;
    location = new Vector2();

    _handleEntityResize = (v) => this.onEntityResize(v);

    static get type() {
        return this.name.toLowerCase();
    }

    constructor(lifespan) {
        super();
        if (lifespan !== undefined) {
            this.lifespan = lifespan;
        }
    }

    start() {}

    /**
     *
     * @param {WebGL2RenderingContext} gl
     * @param {Renderer} renderer
     * @param {number} delta
     */
    draw(gl, renderer, delta) {}

    update(delta) {
        this.lifeTime += delta;
        if (this.lifeTime >= this.lifespan) {
            this.destroy();
        }
    }

    /**
     *
     * @param {Vector2} v
     */
    onEntityResize(v) {
        this.sprite && (this.sprite.size = v.clone());
    }
}

export { Entity };
