import { Vector2 } from "../core/math.js";
import { Sprite } from "../rendering/sprite.js";

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
    static drawer = null;
    static canvas = null;
    static ctx = null;

    static state = {
        isInitialized: false,
        isPaused: false,
    };

    static assets = Assets;

    static entities = {
        data: {
            line: {
                max: 200,
                speed: [75, 150],
                spawnAmount: [10, 20],
            },
            fish: {
                sprite: null,
                speed: [75, 75 * 2],
                max: 20,
            },
            food: {
                sprite: null,
                speed: 75,
                max: 10,
            },
        },
        instances: [],
    };

    static isInitialized() {
        return this.state.isInitialized;
    }

    static isPaused() {
        return this.state.isPaused;
    }

    static init() {
        if (!this.entities.data.fish.sprite) {
            this.entities.data.fish.sprite = new Sprite({
                name: "Fish Sheet",
                imagePath: Assets.get("images/fish/smallswim.png"),
                cols: 10,
                rows: 5,
                size: new Vector2(128, 128),
            });
            this.entities.data.food.sprite = new Sprite({
                name: "Food Sheet",
                imagePath: Assets.get("images/fish/food.png"),
                cols: 10,
                rows: 5,
                size: new Vector2(48, 48),
            });
        }

        this.state.isInitialized = true;
    }
}
window.game = Game;
Game.init();

export { Game, Assets };
