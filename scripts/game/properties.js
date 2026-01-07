import { Sprite } from "./texture.js";

const assets = {
    folder:
        (window.location.origin != "null"
            ? window.location.origin
            : window.location.pathname.replace(
                  new RegExp("/[^/]*$", "gm"),
                  ""
              )) + "/assets/",
    get: function (path) {
        console.log(this.folder)
        return this.folder + path;
    },
};

const game = Object.assign(
    {},
    {
        /** @type {Drawer} */
        drawer: null,
        canvas: null,
        ctx: null,
        state: {
            isInitialized: false,
            isPaused: false,
        },
        isInitialized: function () {
            return this.state.isInitialized;
        },
        isPaused: function () {
            return this.state.isPaused;
        },
        assets,
        entities: {
            data: {
                line: {
                    max: 200,
                    speed: [75, 150],
                    spawnAmount: [10, 20],
                },
                fish: {
                    sprite: new Sprite({name: "Fish Sheet", cols: 10, rows: 5}).load("images/fish/smallswim.png"),
                    speed: [75, 75*2],
                    max: 20,
                },
            },
            instances: [],
        },
    }
);

window.game = game;
window.assets = assets;

export { game, assets };
