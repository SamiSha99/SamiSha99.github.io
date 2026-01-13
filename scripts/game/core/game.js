import { Vector2 } from "./math.js";
import { Sprite } from "../rendering/sprite.js";

class Assets {
    static base =
        (window.location.origin !== "null"
            ? window.location.origin
            : window.location.pathname.replace(
                  new RegExp("/[^/]*$", "gm"),
                  ""
              )) + "/assets/";

    static init = (baseUrl) => baseUrl && (this.base = baseUrl);

    static get(path) {
        if (typeof path !== "string") return "";
        if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
        return this.base + path;
    }
}
window.assets = Assets;

class Game {
    static drawer = null;
    static canvas = null;
    static ctx = null;

    static state = {
        isInitialized: false,
        isPaused: false,
    };

    static assets = Assets;

    static entities = {
        /** @type {object[]} - instances */
        instances: [],
        add: (e) => this.entities.instances.push(e),
        remove: (e) => {
            const i = this.entities.instances.indexOf(e);
            return i != -1 ? this.entities.instances.splice(i, 1) : null;
        },
        getAll: (_class) => {
            return Game.entities.instances.filter(
                (i) => i.constructor.type === _class.type
            );
        },
    };

    static isInitialized = () => this.state.isInitialized;
    static isPaused = () => this.state.isPaused;
    static init = () => (this.state.isInitialized = true);

    static spawn(_class, callback) {
        const entity = new _class();
        this.entities.add(entity);
        callback(entity);
        return entity;
    }
    static destroy = (entity) => this.entities.remove(entity);
}
window.game = Game;
Game.init();

export { Game, Assets };
