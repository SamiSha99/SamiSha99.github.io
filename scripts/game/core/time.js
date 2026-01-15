import { Game } from "./game.js";
import { GlobalEvents } from "./events.js";

class Time extends GlobalEvents {
    currentTime = 0;
    currentRealTime = 0;
    prevTime = performance.now();
    worldDilation = 1;
    update;

    constructor() {
        super();
        requestAnimationFrame(this.loop.bind(this));
    }

    // Returns Real Time Delta
    getDelta() {
        if (Game.state.isPaused) {
            this.prevTime = undefined;
            return 0;
        }

        const currentTime = performance.now();
        if (this.prevTime === undefined) {
            this.prevTime = currentTime;
            return 0;
        }
        const deltaTime = currentTime - this.prevTime;
        this.prevTime = currentTime;
        return deltaTime / 1000;
    }

    setWorldDilation(n = 1) {
        this.worldDilation = Math.max(n, 0);
    }

    setCurrentTime(n) {
        this.currentTime = n;
    }

    setCurrentRealTime(n) {
        this.currentRealTime = n;
    }

    loop() {
        let delta = this.getDelta();

        this.currentRealTime += delta;

        // Global modification
        delta *= this.worldDilation;
        this.currentTime += delta;
        this.update(delta);
        requestAnimationFrame(this.loop.bind(this));
    }

    onFocus() {
        this.prevTime = undefined;
        Game.state.isPaused = false;
    }

    onBlur() {
        this.prevTime = undefined;
        Game.state.isPaused = true;
    }
}

export { Time };
