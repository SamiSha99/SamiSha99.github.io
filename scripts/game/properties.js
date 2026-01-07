const game = Object.assign({}, {
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
    entities: {
        data: {
            line: {
                max: 200,
                speed: [100, 250],
                spawnAmount: [10, 20],
            },
            fish: {
                max: 20,
                speed: [10, 25],
            },
        },
        instances: [],
    },
    assetFolder:
        (window.location.origin != "null"
            ? window.location.origin
            : window.location.pathname.replace(
                  new RegExp("/[^/]*$", "gm"),
                  ""
              )) + "/assets/",
    getAsset: function (path) {
        return this.assetFolder + path;
    },
});

window.game = game;

export { game };
