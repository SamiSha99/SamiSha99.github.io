import { Entity } from "./entity.js";
import { MathUtils } from "../shared/index.js";

// An entity colored by the site hue that can fade in after it spawns.
class EntityAnimated extends Entity {
    static fadeInDelay = 0.25;
    static minFadeInTime = 0.25;
    static maxFadeInTime = 1;
    alpha = 1;
    // Seconds to fade in, 0 shows it right away.
    fadeInTime = 0;
    // The `lifeTime` the fade in started at.
    fadeInStart = 0;

    // Fades in from now, over a random time after the `fadeInDelay`.
    startFadeIn() {
        const { minFadeInTime, maxFadeInTime } = this.constructor;
        this.fadeInStart = this.lifeTime;
        this.fadeInTime = MathUtils.randRange(minFadeInTime, maxFadeInTime);
    }

    getAlpha() {
        if (!this.fadeInTime) return this.alpha;
        const elapsed = this.lifeTime - this.fadeInStart - this.constructor.fadeInDelay;
        return this.alpha * MathUtils.clamp(elapsed / this.fadeInTime, 0, 1);
    }

    // Same as the site hue color, white if the hue isn't animating.
    getHueColor() {
        if (!window.hue) return [248 / 255, 248 / 255, 255 / 255, this.getAlpha()];
        const hue = window.hue.time % 360;
        return [...MathUtils.hslToRgb(hue, 1, 0.655), this.getAlpha()];
    }
}

export { EntityAnimated };
