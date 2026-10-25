import { EntityAnimated } from "./entity_animated.js";
import { MathUtils } from "../shared/index.js";
import { Game } from "../core/game.js";
import { mouse } from "../core/mouse.js";

class Boid extends EntityAnimated {
    type = "Boid";

    static flock = [];
    static count = 160; // 128 * 1.25
    static length = 36;
    static width = 18;
    static minSpeed = 288;
    static maxSpeed = 576;
    static viewRadius = 96;
    static separationRadius = 32;
    static separationWeight = 128;
    static alignmentWeight = 1;
    static cohesionWeight = 0.8;
    // Boids turn back inside within `edgeMargin` of an edge, harder the closer they get.
    static edgeMargin = 128;
    static edgeWeight = 4096;
    // The pointer scares boids within the `fleeRadius`, the scared boids flee from it faster than their max speed,
    // and the fear spreads to their neighbors (but weaker with each hop), so a whole swarm flees together.
    static fleeRadius = 128;
    static fleeWeight = 2048;
    static fleeSpeedMultiplier = 3;
    static fearSpread = 0.8;
    // Seconds before a fully scared boid becomes calm.
    static fearDuration = 1;
    // in Degrees per second.
    static rainbowSpeed = 360;
    // Seconds to fade fully into the rainbow once scared.
    static rainbowFadeIn = 0.5;
    static spawned = 0;
    // 0 = calm | 1 = panicking.
    fear = 0;
    // How much of the rainbow is showing, catches up to `fear` over time.
    rainbow = 0;
    rainbowHue = Math.random() * 360;

    constructor() {
        super();
        // The canvas is split into a grid with a cell per boid each spawns at a random point of its own
        // cell so they're spread evenly instead of clumping in random spots.
        const w = Game.canvas.width;
        const h = Game.canvas.height;
        const cols = Math.max(1, Math.round(Math.sqrt((Boid.count * w) / h)));
        const rows = Math.ceil(Boid.count / cols);
        const cell = Boid.spawned++ % (cols * rows);
        this.x = ((cell % cols) + Math.random()) * (w / cols);
        this.y = (Math.floor(cell / cols) + Math.random()) * (h / rows);
        const angle = Math.random() * Math.PI * 2;
        const speed = MathUtils.randRange(Boid.minSpeed, Boid.maxSpeed);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = MathUtils.randRange(0.4, 0.8);
        this.startFadeIn();
        Boid.flock.push(this);
    }

    onDestroy() {
        const i = Boid.flock.indexOf(this);
        if (i !== -1) Boid.flock.splice(i, 1);
    }

    update(delta) {
        super.update(delta);

        let count = 0;
        let avgVx = 0,
            avgVy = 0,
            avgX = 0,
            avgY = 0;
        let sepX = 0,
            sepY = 0;
        let neighborFear = 0;
        const viewRadiusSq = Boid.viewRadius * Boid.viewRadius;
        for (const other of Boid.flock) {
            if (other === this) continue;
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            // Squared first, so the square root is only taken for actual neighbors.
            const distanceSq = dx * dx + dy * dy;
            if (distanceSq === 0 || distanceSq > viewRadiusSq) continue;
            const distance = Math.sqrt(distanceSq);
            count++;
            avgVx += other.vx;
            avgVy += other.vy;
            avgX += other.x;
            avgY += other.y;
            neighborFear = Math.max(neighborFear, other.fear);
            // Pushes away harder the closer they are.
            if (distance < Boid.separationRadius) {
                const push = 1 - distance / Boid.separationRadius;
                sepX -= (dx / distance) * push;
                sepY -= (dy / distance) * push;
            }
        }
        const fear = Math.max(this.fear, neighborFear * Boid.fearSpread);
        this.fear = Math.max(0, fear - delta / Boid.fearDuration);
        if (mouse.active && Math.hypot(this.x - mouse.x, this.y - mouse.y) < Boid.fleeRadius) {
            this.fear = 1;
        }
        // Fades in and out with the rainbow.
        this.rainbow = Math.min(this.fear, this.rainbow + delta / Boid.rainbowFadeIn);

        let ax = sepX * Boid.separationWeight;
        let ay = sepY * Boid.separationWeight;
        if (count > 0) {
            ax += (avgVx / count - this.vx) * Boid.alignmentWeight;
            ay += (avgVy / count - this.vy) * Boid.alignmentWeight;
            ax += (avgX / count - this.x) * Boid.cohesionWeight;
            ay += (avgY / count - this.y) * Boid.cohesionWeight;
        }
        // Runs away from where the pointer was last seen, faster the more scared it is.
        if (this.fear > 0) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.hypot(dx, dy) || 1;
            ax += (dx / distance) * Boid.fleeWeight * this.fear;
            ay += (dy / distance) * Boid.fleeWeight * this.fear;
        }
        // Turns away from the edges before reaching them.
        const w = Game.canvas.width;
        const h = Game.canvas.height;
        const edge = Boid.edgeMargin;
        if (this.x < edge) ax += (1 - this.x / edge) * Boid.edgeWeight;
        else if (this.x > w - edge) ax -= (1 - (w - this.x) / edge) * Boid.edgeWeight;
        if (this.y < edge) ay += (1 - this.y / edge) * Boid.edgeWeight;
        else if (this.y > h - edge) ay -= (1 - (h - this.y) / edge) * Boid.edgeWeight;

        this.vx += ax * delta;
        this.vy += ay * delta;
        const speed = Math.hypot(this.vx, this.vy) || 1;
        const maxSpeed = Boid.maxSpeed * MathUtils.lerp(1, Boid.fleeSpeedMultiplier, this.fear);
        const clamped = MathUtils.clamp(speed, Boid.minSpeed, maxSpeed);
        this.vx *= clamped / speed;
        this.vy *= clamped / speed;

        this.x += this.vx * delta;
        this.y += this.vy * delta;
        // Bounces off the edges if turning wasn't enough, like when fleeing faster than it can turn.
        const margin = Boid.length / 2;
        if (this.x < margin) {
            this.x = margin;
            this.vx = Math.abs(this.vx);
        } else if (this.x > w - margin) {
            this.x = w - margin;
            this.vx = -Math.abs(this.vx);
        }
        if (this.y < margin) {
            this.y = margin;
            this.vy = Math.abs(this.vy);
        } else if (this.y > h - margin) {
            this.y = h - margin;
            this.vy = -Math.abs(this.vy);
        }
    }

    getColor() {
        const color = this.getHueColor();
        if (this.rainbow <= 0) return color;
        const t = this.rainbow * this.rainbow * (3 - 2 * this.rainbow);
        const hue = (this.rainbowHue + this.lifeTime * Boid.rainbowSpeed) % 360;
        const rainbow = MathUtils.hslToRgb(hue, 1, 0.655);
        return [
            MathUtils.lerp(color[0], rainbow[0], t),
            MathUtils.lerp(color[1], rainbow[1], t),
            MathUtils.lerp(color[2], rainbow[2], t),
            color[3],
        ];
    }

    draw(_gl, renderer, _delta) {
        const speed = Math.hypot(this.vx, this.vy) || 1;
        const fx = this.vx / speed;
        const fy = this.vy / speed;
        const px = -fy * (Boid.width / 2);
        const py = fx * (Boid.width / 2);
        const front = Boid.length * 0.6;
        const back = Boid.length * 0.4;
        const vertices = [
            this.x + fx * front,
            this.y + fy * front,
            this.x - fx * back + px,
            this.y - fy * back + py,
            this.x - fx * back - px,
            this.y - fy * back - py,
        ];
        renderer.programs.triangle.draw(vertices, this.getColor());
    }
}

export { Boid };
