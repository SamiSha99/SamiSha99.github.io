import { Time } from "../shared/time.js";
import { GlobalEvents } from "./events.js";
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

class Game extends GlobalEvents {
    /** @type {Game | null} */
    static instance = null;
    /** @type {Time} */
    time;
    /** @type {Renderer} */
    renderer;
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
                (i) => i.constructor.type === _class.type && predicate(i),
            );
        },
    };

    static isInitialized = () => this.state.isInitialized;
    static isPaused = () => this.state.isPaused;

    constructor() {
        super();
        this.time = new Time();
        this.renderer = new Renderer();
        this.time.update = this.update.bind(this);
        Game.instance = this;
    }

    init() {
        Game.state.isInitialized = true;
    }

    update(delta) {
        if (!Game.isInitialized()) return;

        for (let entity of Game.entities.instances) {
            if (typeof entity.update === "function") entity.update(delta);
        }
        this.draw(delta, this.renderer);
    }

    draw(delta, renderer) {
        renderer.draw(delta);
    }

    /**
     * Constructs an `entityClass`, adds it to {@link Game.entities}, and returns it.
     * `args` forwards to the constructor, an array spreads as positional args, an object passes through as one.
     *
     * @template T
     * @param {new (...args: any[]) => T} entityClass - The entity class to construct.
     * @param {((entity: T) => void) | null} [callback] - Called with the entity after it's added.
     * @param {unknown[] | Record<string, unknown> | null} [args] - Constructor arguments.
     * @returns {T} The spawned entity.
     *
     * @example Game.spawn(Snowflake, (flake) => (flake.alpha = 1), [0])
     */
    static spawn(entityClass, callback, args) {
        // null would be passed through as a single argument, treat it as no args instead
        if (args === null) args = undefined;
        let entity;

        if (args === undefined) entity = new entityClass();
        else if (Array.isArray(args)) entity = new entityClass(...args);
        else entity = new entityClass(args);

        this.entities.add(entity);
        callback && callback(entity);
        return entity;
    }
    static destroy = (entity) => this.entities.remove(entity);
}
window.game = Game;

export { Game, Assets };
