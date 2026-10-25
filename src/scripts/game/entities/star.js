import { EntityAnimated } from "./entity_animated.js";
import { Vector2, MathUtils } from "../shared/index.js";
import { Game } from "../core/game.js";

class Star extends EntityAnimated {
    type = "Star";

    static count = 200;
    static minDepth = 1;
    static maxDepth = 400;
    static minSize = 1.5;
    static maxSize = 12;
    static decayRate = 0.6;
    static fadeOutTime = 0.2;
    dying = false;
    static trailLengthFactor = 8;
    static deadzoneRadius = 128;

    constructor() {
        super();
        this.setupStar();
    }

    update(delta) {
        super.update(delta);
        this.depth *= Math.exp(-Star.decayRate * delta);
        if (!this.dying && (this.depth <= Star.minDepth || this.isOffScreen())) {
            this.dying = true;
            this.dyingSince = this.lifeTime;
        }
        if (this.dying && this.lifeTime - this.dyingSince >= Star.fadeOutTime) {
            this.setupStar();
        } else {
            this.updateVisuals();
        }
    }

    isOffScreen() {
        const { width, height } = Game.canvas;
        const screenX = width * 0.5 + this.location.x / this.depth;
        const screenY = height * 0.5 + this.location.y / this.depth;
        return screenX < 0 || screenX > width || screenY < 0 || screenY > height;
    }

    setupStar() {
        this.depth = MathUtils.lerp(Star.minDepth, Star.maxDepth, Math.random());
        const { width, height } = Game.canvas;
        let offsetX = (Math.random() - 0.5) * width;
        let offsetY = (Math.random() - 0.5) * height;

        const offsetRadius = Math.hypot(offsetX, offsetY) || 1;
        if (offsetRadius < Star.deadzoneRadius) {
            const scale = Star.deadzoneRadius / offsetRadius;
            offsetX *= scale;
            offsetY *= scale;
        }
        this.location = new Vector2(offsetX * this.depth, offsetY * this.depth);
        this.startFadeIn();
        this.dying = false;
        // Forces draw() to re-seed its trail
        this.prevScreenX = undefined;
        this.prevScreenY = undefined;
        this.updateVisuals();
    }

    // 0 = just spawned far away, 1 = about to pass the camera.
    getProximity() {
        const t = (this.depth - Star.minDepth) / (Star.maxDepth - Star.minDepth);
        return 1 - MathUtils.clamp(t, 0, 1);
    }

    updateVisuals() {
        const proximity = this.getProximity();
        this.alpha = MathUtils.lerp(0.25, 0.9, proximity);
        this.size = MathUtils.lerp(Star.minSize, Star.maxSize, proximity);
        this.color = this.getColor();
    }

    getColor() {
        return this.getHueColor();
    }

    getAlpha() {
        const fadeOut = this.dying
            ? 1 - MathUtils.clamp((this.lifeTime - this.dyingSince) / Star.fadeOutTime, 0, 1)
            : 1;
        return super.getAlpha() * fadeOut;
    }

    draw(_gl, renderer, _delta) {
        const { width, height } = renderer.canvas;
        const screenX = width * 0.5 + this.location.x / this.depth;
        const screenY = height * 0.5 + this.location.y / this.depth;

        if (this.prevScreenX === undefined) {
            this.prevScreenX = screenX;
            this.prevScreenY = screenY;
        }

        const dx = screenX - this.prevScreenX;
        const dy = screenY - this.prevScreenY;
        const distance = Math.hypot(dx, dy);
        const [r, g, b, a] = this.color;

        if (distance >= 0.5) {
            const trailLength = this.size * Star.trailLengthFactor;
            const ux = dx / distance;
            const uy = dy / distance;
            const tailX = screenX - ux * trailLength;
            const tailY = screenY - uy * trailLength;

            const px = -uy;
            const py = ux;
            const taper = (halfWidth, fade) =>
                renderer.programs.triangle.draw(
                    [
                        tailX,
                        tailY,
                        screenX + px * halfWidth,
                        screenY + py * halfWidth,
                        screenX - px * halfWidth,
                        screenY - py * halfWidth,
                    ],
                    [r, g, b, fade],
                );
            // soft halo
            taper(this.size * 0.9, a * 0.25);
            taper(this.size * 0.35, a * 0.55);
        }

        renderer.programs.point.draw(screenX, screenY, this.size * 2.5, [r, g, b, a * 0.3]);
        renderer.programs.point.draw(screenX, screenY, this.size, [r, g, b, a]);

        this.prevScreenX = screenX;
        this.prevScreenY = screenY;
    }
}

export { Star };
