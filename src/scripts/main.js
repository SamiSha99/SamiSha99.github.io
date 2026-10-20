import { Game, MathUtils, Snowflake } from "./game/index.js";

// 🤫😅🤭🙈🙉🙊
function _0x3c5033() {
    let _0x1d5b15 = "U1RKV2RGbFhiSE09";
    let _0x5bf685 = "WXpKR2RHRlROWHBoUjBaeVlUSTVNV05yUW05aU0xSjBXVmRzYzB4dFRuWmlVVDA5";
    for (let _0x35a4c9 = 0; _0x35a4c9 < 3; _0x35a4c9++) {
        _0x1d5b15 = atob(_0x1d5b15);
        _0x5bf685 = atob(_0x5bf685);
    }
    window.location.href = "mailto:" + _0x5bf685;
}
window._0x3c5033 = _0x3c5033;

const hue = { time: Math.random() * 360, speed: 6 };
window.hue = hue;

function updateHue(delta) {
    hue.time += delta * hue.speed;
    document.body.style.setProperty("--default-hue", String(Math.round(hue.time % 360)));
    document.body.style.setProperty("--dash-progress", String(((1.25 * hue.time) / 8) % 1));
}

/** @type {SiteAnimations} */
let game;

class SiteAnimations extends Game {
    // Pages marked `no-drawing` only animate the hue.
    drawing = document.body.getAttribute("no-drawing") !== "true";
    spawnSnowDelay = 0;

    static start() {
        if (game) {
            game.time.start();
            game.renderer.canvas.style.display = "";
            return;
        }

        game = new SiteAnimations();
        game.init();
    }

    static stop() {
        game?.time.stop();
        if (game) game.renderer.canvas.style.display = "none";
        document.body.style.removeProperty("--default-hue");
        document.body.style.removeProperty("--dash-progress");
    }

    init() {
        super.init();
        updateHue(0);
        if (!this.drawing) return;

        // Start with it already snowing
        for (let i = 0; i < 500; i++) {
            Game.spawn(Snowflake, null, [
                MathUtils.randRange(0, this.renderer.canvas.height),
                true,
            ]);
        }
    }

    update(delta) {
        updateHue(delta);
        if (!this.drawing) return;

        super.update(delta);
        this.spawnSnow(delta);
    }

    spawnSnow(delta) {
        if (this.time.currentRealTime <= Snowflake.fadeInDelay) return;
        this.spawnSnowDelay -= delta;
        if (this.spawnSnowDelay > 0) return;

        if (Game.entities.getAll(Snowflake).length < Snowflake.max) Game.spawn(Snowflake);
        const spawnRate = [45, 50];
        this.spawnSnowDelay = 1 / MathUtils.randRange(spawnRate[0], spawnRate[1]);
    }
}

window.animations = SiteAnimations;

// Reduced motion or turned off from the footer.
if (!document.documentElement.classList.contains("no-motion")) SiteAnimations.start();

