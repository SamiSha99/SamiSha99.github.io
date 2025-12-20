var canvas,
    ctx,
    lines = [],
    fish = [];
const color = "rgb(0, 0, 0)",
    transparentWhite = "rgba(248, 248, 255, 0.5)";
var isPaused, isInitialized;
const lineLength = 25,
    lineThickness = 2.5,
    maxLines = 200;
const speedRange = [100, 250];
const spawnAmountRange = [10, 20];

const image = new Image(800, 400);
const imagefolder =
    (window.location.origin != "null"
        ? window.location.origin
        : window.location.pathname.replace(new RegExp("/[^/]*$", "gm"), "")) +
    "/assets/images/fish/";
image.src = imagefolder + "smallswim.png";

const fishSprite = {
    image: image,
    width: image.width,
    height: image.height,
    cols: 10,
    rows: 5,
    spriteWidth: image.width / 10,
    spriteHeight: image.height / 5,
    size: 128,
    currentFrame: 0,
    frameTime: 0.1, // seconds per frame
};

function AddNewLine() {
    let multiplier = Math.max(canvas.height / 1080, 1);
    if (lines.length < Math.round(maxLines * multiplier)) {
        let line = {};
        line.direction = GetDirection(Math.floor(Math.random() * 2));
        line.offset = GetOffSet();
        line.speed = randRange(speedRange[0], speedRange[1]) * GetSpeedDirection(line.direction);
        line.location = GetLocation(line.direction);
        lines.push({
            direction: line.direction,
            offset: line.offset,
            speed: line.speed,
            startSpeed: line.speed,
            location: line.location,
        });
        spawnLineDelay =
            (1 / multiplier) * randRange(1 / spawnAmountRange[0], 1 / spawnAmountRange[1]);
    }
}

function AddFish() {
    const direction = GetDirection(Math.floor(Math.random() * 2));
    let f = {};
    f = {
        direction: direction,
        speed: randRange(speedRange[0], speedRange[1]) * GetSpeedDirection(direction),
        location: {
            x: direction == "left" ? fishSprite.size + canvas.width : -fishSprite.size,
            y: randRangeInt(canvas.height / fishSprite.size, canvas.height - fishSprite.size),
        },
        time: 0,
        frameTime: fishSprite.frameTime,
        type: GetFishType(),
    };
    fish.push(f);
}

function GetFishType() {
    // removed king fish
    const types = {
        0: 0,
        1: 1,
        2: 2,
        // pirahna fish sprite row
        3: 4,
    };
    return types[Math.floor(Math.random() * Object.keys(types).length)];
}

function clamp(n, min, max) {
    if (min > max) {
        let tmp = min;
        min = max;
        max = tmp;
    }
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

function randRange(min, max) {
    if (min > max) {
        let tmp = min;
        min = max;
        max = tmp;
    }

    return Math.random() * (max - min) + min;
}

function randRangeInt(min, max) {
    return Math.floor(randRange(min, max));
}

function draw() {
    // clean the frame so we can draw the next one
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = lineThickness;
    for (i = 0; i < lines.length; i++) {
        // begin
        ctx.beginPath();
        switch (lines[i].direction) {
            case "left":
                ctx.moveTo(lines[i].location, lines[i].offset);
                ctx.lineTo(lines[i].location + lineLength, lines[i].offset);
                break;
            case "right":
                ctx.moveTo(lines[i].location + lineLength, lines[i].offset);
                ctx.lineTo(lines[i].location, lines[i].offset);
                break;
        }
        // apply gradient
        ctx.strokeStyle = transparentWhite;
        // end
        ctx.stroke();
    }
    // fish
    for (i = 0; i < fish.length; i++) {
        if (fish[i].direction == "right") {
            ctx.save();
            ctx.translate(canvas.width - (canvas.width - fish[i].location.x * 2), 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(
            // Sprite sheet
            fishSprite.image,
            // The sprite frame to draw
            Math.max(0, Math.round((fish[i].time % 1) / fish[i].frameTime) - 1) *
                fishSprite.spriteWidth,
            fish[i].type * fishSprite.spriteHeight,
            // Size of the sprite frame
            fishSprite.spriteWidth,
            fishSprite.spriteHeight,
            // location of the sprite frame
            fish[i].location.x,
            fish[i].location.y,
            // size on the canvas
            fishSprite.size,
            fishSprite.size
        );
        fish[i].direction == "right" && ctx.restore();
    }
}

function move(delta) {
    if (lines.length <= 0) return;
    for (i = 0; i < lines.length; i++) {
        lines[i].location += lines[i].speed * delta;
        lines[i].speed += lines[i].startSpeed * delta * 0.4;
        if (shouldRemoveLine(i)) {
            lines.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < fish.length; i++) {
        fish[i].location.x += fish[i].speed * delta;
        fish[i].time += delta * ((Math.abs(fish[i].speed) / speedRange[0]) * 0.8);
        if (fish[i].location.x < -fishSprite.size) {
            fish.splice(i, 1);
            i--;
        }
    }
}

function GetDirection(val) {
    return val ? "left" : "right";
}

function GetOffSet() {
    let maxLength = canvas.height;
    let minLength = maxLength / 96;
    return randRangeInt(minLength, maxLength);
}

function GetLocation(dir) {
    return dir == "left" ? canvas.width + lineLength : -lineLength;
}

function GetSpeedDirection(dir) {
    return dir == "left" ? -1 : 1;
}

function shouldRemoveLine(i) {
    let direction = lines[i].direction;
    let location = lines[i].location;
    if (direction == "left" && location < -lineLength) return true;
    if (direction == "right" && location > canvas.width + lineLength) return true;
    return false;
}

// Time dilation with pause implementation
var prevTime = undefined;
var worldDilation = 1;

function loop() {
    var delta;
    if (!isPaused && isInitialized) {
        var time = new Date();
        if (prevTime != undefined) {
            delta = time - prevTime;
            delta /= 1000;
            delta *= worldDilation;
        }
        prevTime = time;
        if (delta != undefined) Update(delta);
    }
    requestAnimationFrame(loop);
}

var spawnLineDelay = 0;
var fishAnimation = 0;
var time = 0;
const offsetTime = Math.random() * 360;
window.animationSpeed = 6;
function Update(delta) {
    spawnLineDelay -= delta;
    time += delta;
    if (spawnLineDelay <= 0) {
        AddNewLine();
        if (randRange(0, 1) < 0.01) {
            AddFish();
        }
    }
    draw();
    move(delta);
    const animationTime = time * window.animationSpeed + offsetTime;
    document.body.style = "--default-hue:" + Math.round(animationTime % 360);
    fishAnimation -= delta;
    if (fishAnimation <= 0.1) {
        fishAnimation = 0;
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

function run() {
    const c = document.createElement("canvas");
    c.id = "mainCanvas";
    ctx = c.getContext("2d");

    canvas = c;
    setTimeout(() => {
        canvas.width = Math.max(document.body.clientWidth, 0);
        canvas.height = Math.max(screen.height, window.innerHeight, 0);
        document.body.insertBefore(c, document.body.firstChild);
        isInitialized = true;
        AddNewLine();
        requestAnimationFrame(loop);
    }, 100);
}

function OpenProjectLink(button) {
    window.open(button.title, "_blank");
}

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

run();
