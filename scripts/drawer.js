window.game = {
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
      : window.location.pathname.replace(new RegExp("/[^/]*$", "gm"), "")) +
    "/assets/",
  getAsset: function (path) {
    return this.assetFolder + path;
  },
};

class Sprite {
  constructor(
    name,
    imagePath,
    frameWidth,
    frameHeight,
    cols,
    rows,
    size,
    frameTime
  ) {
    this.image = new Image();
    this.name = name ?? "Unnamed Sprite";
    this.image.src = imagePath;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.cols = cols;
    this.rows = rows;
    this.size = size;
    this.frameTime = frameTime;
  }
}

class Time {
  // Time dilation with pause implementation
  prevTime = performance.now();
  worldDilation = 1;
  update;
  constructor() {
    requestAnimationFrame(this.loop.bind(this));
  }

  getDelta() {
    if (game.state.isPaused) {
      this.prevTime = undefined;
      return 0;
    }

    const currentTime = performance.now();
    if (this.prevTime === undefined) {
      this.prevTime = currentTime;
      return 0;
    }
    const deltaTime = (currentTime - this.prevTime) * this.worldDilation;
    this.prevTime = currentTime;
    return deltaTime / 1000;
  }

  loop() {
    let delta = this.getDelta();
    this.update(delta);
    requestAnimationFrame(this.loop.bind(this));
  }
}

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    x != undefined && (this.x = x);
    y != undefined && (this.y = y);
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }
  divide(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  normalize() {
    const len = this.length();
    if (len === 0) return new Vector2(0, 0);
    return this.divide(len);
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
}

class Drawer {
  /**@type {HTMLCanvasElement} - canvas */
  canvas;
  /** @type {CanvasRenderingContext2D} */
  ctx;
  time = new Time();
  constructor(canvas) {
    this.time.update = this.update.bind(this);
    if (!canvas) {
      this.canvas = document.createElement("canvas");
    } else this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  spawnLineDelay = 0;
  update(delta) {
    this.draw(delta);
    for (let entity of game.entities.instances) {
      if (typeof entity.update === "function") entity.update(delta);
    }

    spawnLineDelay -= delta;
    if (spawnLineDelay <= 0) {
      window.game.entities.instances.push(new Line());

      const spawnRate = window.game.entities.data.line.spawnAmount;
      spawnLineDelay = MathUtils.randRange(spawnRate[0], spawnRate[1]);
      if (Math.random() < 0.01) {
        // AddFish();
        console.log("Spawn fish! :3");
      }
    }
  }

  draw(delta) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let entity of game.entities.instances) {
      if (typeof entity.draw === "function") entity.draw(this.ctx, delta);
    }
  }

  static clearCanvas() {
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  }
  static drawLine(line) {
    game.ctx.strokeStyle = line.color;
    game.ctx.lineWidth = game.entities.data.line.thickness;
    game.ctx.beginPath();
    if (line.direction === "right") {
      game.ctx.moveTo(line.location, line.offset);
      game.ctx.lineTo(
        line.location - game.entities.data.line.length,
        line.offset
      );
    } else {
      game.ctx.moveTo(line.location, line.offset);
      game.ctx.lineTo(
        line.location + game.entities.data.line.length,
        line.offset
      );
    }
  }
}

class Entity {
  lifeTime = 0;
  lifespan = Infinity;
  location = new Vector2();
  constructor(lifespan) {
    lifespan !== undefined && (this.lifespan = lifespan);
  }
  start() {}
  draw(ctx, delta) {}
  update(delta) {
    this.lifeTime += delta;
    if (this.lifeTime >= this.lifespan) {
      // remove entity
      const index = game.entities.instances.indexOf(this);
      if (index > -1) game.entities.instances.splice(index, 1);
    }
  }
}

class Fish extends Entity {
  static sprite = window.game.assetFolder + "/images/fish/smallswim.png";
  typeReference = {
    0: 0,
    1: 1,
    2: 2,
    // pirahna fish sprite row
    3: 4,
  };
  spriteWidth = 128;
  spriteHeight = 128;

  constructor(name, type = null) {
    this.name = name;
    direction = Math.random() < 0.5 ? "left" : "right";
    this.location = new Vector2(
      direction == "left" ? canvas.width + lineLength : -lineLength,
      MathUtils.rangeRandInt(0, canvas.height - this.spriteHeight)
    );
    this.type = type ?? this.GetFishType();
  }

  draw(ctx, _delta) {
    if (this.direction == "right") {
      ctx.save();
      ctx.translate(canvas.width - (canvas.width - this.location.x * 2), 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      // Sprite sheet
      this.sprite.image,
      // The sprite frame to draw
      Math.max(0, Math.round((this.time % 1) / this.frameTime) - 1) *
        this.spriteWidth,
      this.type * this.spriteHeight,
      // Size of the sprite frame
      this.spriteWidth,
      this.spriteHeight,
      // location of the sprite frame
      this.location.x,
      this.location.y,
      // size on the canvas
      this.sprite.size,
      this.sprite.size
    );
    this.direction == "right" && ctx.restore();
  }
  GetFishType() {
    return this.typeReference[
      MathUtils.rangeRandInt(0, Object.keys(this.typeReference).length - 1)
    ];
  }
}

class Line extends Entity {
  color = "rgba(248, 248, 255, 0.5)";
  length = 25;
  thickness = 2.5;
  constructor(speed, location, color = null) {
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.offset = this.getOffset();
    const speedRange = window.game.entities.data.line.speed;
    this.startSpeed = MathUtils.randRange(speedRange[0], speedRange[1]);
    this.speed = this.startSpeed * this.direction;
    this.location = location;
    if (color) {
      this.color = color;
    }
  }

  draw(ctx, delta) {
    const lineThickness = window.game.entities.data.line.thickness;
    const lineLength = window.game.entities.data.line.length;
    ctx.lineWidth = lineThickness;

    ctx.beginPath();
    switch (this.direction) {
      case -1:
        ctx.moveTo(this.location, this.offset);
        ctx.lineTo(this.location + lineLength, this.offset);
        break;
      case 1:
        ctx.moveTo(this.location + lineLength, this.offset);
        ctx.lineTo(this.location, this.offset);
        break;
    }
    // apply gradient
    ctx.strokeStyle = transparentWhite;
    // end
    ctx.stroke();
  }

  getOffset() {
    let maxLength = window.game.canvas.height;
    let minLength = maxLength / 96;
    return MathUtils.randRange(minLength, maxLength);
  }
}

class MathUtils {
  static randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  static rangeRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start, end, t) {
    return start + t * (end - start);
  }
}

window.onfocus = function () {
  prevTime = undefined;
  isPaused = false;
};

window.onblur = function () {
  prevTime = undefined;
  isPaused = true;
};

function main() {
  window.game.drawer = new Drawer();
  const drawer = window.game.drawer;
  const c = document.createElement("canvas");
  c.id = "mainCanvas";
  drawer.canvas = c;
  drawer.ctx = c.getContext("2d");
  setTimeout(() => {
    c.width = Math.max(document.body.clientWidth, 0);
    c.height = Math.max(screen.height, window.innerHeight, 0);
    document.body.insertBefore(c, document.body.firstChild);
    window.game.state.isInitialized = true;
  }, 100);
}
main();
