import { Game } from "../core/Game.js";
import { GlobalEvents } from "../core/Events.js";
import { Vector2 } from "../core/math.js";

class Entity extends GlobalEvents {
    location = new Vector2();
    size = new Vector2(32, 32);
    speed = 100;
    sprite = null;
    lifeTime = 0;
    lifespan = Infinity;
    location = new Vector2();

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
}

export { Entity };
