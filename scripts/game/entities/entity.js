import { Game } from "../core/game.js";
import { GlobalEvents } from "../core/events.js";
import { Vector2 } from "../core/math.js";

class Entity extends GlobalEvents {
    lifeTime = 0;
    lifespan = Infinity;
    location = new Vector2();

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
            const index = Game.entities.instances.indexOf(this);
            if (index > -1) Game.entities.instances.splice(index, 1);
        }
    }
}

export { Entity };
