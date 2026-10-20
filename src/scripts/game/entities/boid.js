import { Entity } from "./entity.js";
import { Vector2, MathUtils } from "../shared/index.js";
import { Game } from "../core/game.js";

class Boid extends Entity {
    type = "Boid";

    static count = 160;
    static length = 12;
    static width = 6;
    static minSpeed = 128;
    static maxSpeed = 256;
    static viewRadius = 32;
    static separationRadius = 16;
    static separationWeight = 128;
    static alignmentWeight = 0.8;
    static cohesionWeight = 0.4;
    static spawned = 0;

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
        this.location = new Vector2(this.x, this.y);
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
        for (const other of Game.entities.getAll(Boid)) {
            if (other === this) continue;
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.hypot(dx, dy);
            if (distance === 0 || distance > Boid.viewRadius) continue;
            count++;
            avgVx += other.vx;
            avgVy += other.vy;
            avgX += other.x;
            avgY += other.y;
            // Pushes away harder the closer they are.
            if (distance < Boid.separationRadius) {
                const push = 1 - distance / Boid.separationRadius;
                sepX -= (dx / distance) * push;
                sepY -= (dy / distance) * push;
            }
        }

        let ax = sepX * Boid.separationWeight;
        let ay = sepY * Boid.separationWeight;
        if (count > 0) {
            ax += (avgVx / count - this.vx) * Boid.alignmentWeight;
            ay += (avgVy / count - this.vy) * Boid.alignmentWeight;
            ax += (avgX / count - this.x) * Boid.cohesionWeight;
            ay += (avgY / count - this.y) * Boid.cohesionWeight;
        }

        this.vx += ax * delta;
        this.vy += ay * delta;
        const speed = Math.hypot(this.vx, this.vy) || 1;
        const clamped = MathUtils.clamp(speed, Boid.minSpeed, Boid.maxSpeed);
        this.vx *= clamped / speed;
        this.vy *= clamped / speed;

        this.x += this.vx * delta;
        this.y += this.vy * delta;
        // Bounces off the edges
        const margin = Boid.length / 2;
        const w = Game.canvas.width;
        const h = Game.canvas.height;
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
        this.location = new Vector2(this.x, this.y);
    }

    getHueColor() {
        if (!window.hue) return [248 / 255, 248 / 255, 255 / 255, this.alpha];
        const hue = window.hue.time % 360;
        return [...MathUtils.hslToRgb(hue, 1, 0.655), this.alpha];
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
        renderer.programs.triangle.draw(vertices, this.getHueColor());
    }
}

export { Boid };

