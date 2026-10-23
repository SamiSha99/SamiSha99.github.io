import { Boid, Game, MathUtils, Snowflake } from "./game/index.js";

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

// base.njk
const root = document.documentElement.style;
// set in <head> in base.njk before load
const startHue = root.getPropertyValue("--default-hue");
const hue = { time: startHue ? Number(startHue) : Math.random() * 360, speed: 6 };
window.hue = hue;

function updateHue(delta) {
    hue.time += delta * hue.speed;
    root.setProperty("--default-hue", String(Math.round(hue.time % 360)));
    root.setProperty("--dash-progress", String(((1.25 * hue.time) / 8) % 1));
}

/** @type {SiteAnimations} */
let game;

class SiteAnimations extends Game {
    // Pages marked `no-drawing` only animate the hue.
    drawing = document.body.getAttribute("no-drawing") !== "true";
    // Set by the page's `animation` (e.g. `animation: boids`), snow if not set.
    animation = document.body.getAttribute("animation") ?? "snow";
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
        root.removeProperty("--default-hue");
        root.removeProperty("--dash-progress");
    }

    // Swaps the running animation for another.
    static setAnimation(animation) {
        if (!game) return;
        for (const entity of [...Game.entities.instances]) entity.destroy();
        game.animation = animation;
        if (game.drawing) game.spawnAnimation();
    }

    init() {
        super.init();
        updateHue(0);
        if (this.drawing) this.spawnAnimation();
    }

    spawnAnimation() {
        switch (this.animation) {
            case "snow":
                // Start with it already snowing
                for (let i = 0; i < 500; i++) {
                    Game.spawn(Snowflake, null, [
                        MathUtils.randRange(0, this.renderer.canvas.height),
                        true,
                    ]);
                }
                break;
            case "boids":
                for (let i = 0; i < Boid.count; i++) Game.spawn(Boid);
                break;
        }
    }

    update(delta) {
        updateHue(delta);
        if (!this.drawing) return;

        super.update(delta);
        switch (this.animation) {
            case "snow":
                this.spawnSnow(delta);
                break;
        }
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

