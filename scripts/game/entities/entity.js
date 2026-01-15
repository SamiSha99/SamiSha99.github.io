import { Game } from "../core/game.js";
import { GlobalEvents } from "../core/events.js";
import { Vector2 } from "../core/math.js";
import { Sprite } from "../core/rendering/sprite.js";

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

    draw(ctx, delta) {}

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
