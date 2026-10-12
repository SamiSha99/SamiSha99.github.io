import { Renderer } from "./rendering/renderer.js";

class Assets {
    static base =
        (window.location.origin !== "null"
            ? window.location.origin
            : window.location.pathname.replace(new RegExp("/[^/]*$", "gm"), "")) + "/assets/";

    static init = (baseUrl) => baseUrl && (this.base = baseUrl);

    static get(path) {
        if (typeof path !== "string") return "";
        if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
        return this.base + path;
    }
}
window.assets = Assets;

class Game {
    /** @type {Renderer} - renderer */
    static renderer = null;
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
        /**
         * @param {Function} _class
         * @param {(entity: any) => boolean} [predicate]
         * @returns {any[]}
         */
        getAll: (_class, predicate = () => true) => {
            return Game.entities.instances.filter(
                (i) => i.constructor.type === _class.type && predicate(i)
            );
        },
    };

    static isInitialized = () => this.state.isInitialized;
    static isPaused = () => this.state.isPaused;
    static init = () => (this.state.isInitialized = true);

    static spawn(entityClass, callback) {
        const entity = new entityClass();
        this.entities.add(entity);
        callback && callback(entity);
        return entity;
    }
    static destroy = (entity) => this.entities.remove(entity);
}
window.game = Game;
Game.init();

export { Game, Assets };
