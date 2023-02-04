var canvas, ctx, lines = [];
const color = "rgb(120, 81, 169)", transparentWhite = "rgba(255, 255, 255, 0.55)";
var isPaused, isInitialized;
// Line Attributes
const lineLength = 350, lineThickness = 4.5, maxLines = 100;
// Line Speed
const speedRange = [1500, 2000];
// Spawn rate
// 1 / this -> in seconds
const spawnAmountRange = [14.0, 18.0];

function AddNewLine() {
    let multiplier = Math.max(canvas.height / 1080 * 1.25, 1);
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
        spawnLineDelay = (1 / multiplier) * randRange(1/spawnAmountRange[0], 1/spawnAmountRange[1]);
    }
}

function clamp(n, min, max) {
    if (min > max) {
        let tmp = min;
        min = max;
        max = tmp;
    }
    if (n < min)
        return min;
    if (n > max)
        return max;
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

function drawLine() {
    // clean the frame so we can draw the next one
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let grd = undefined;
    ctx.lineWidth = lineThickness;
    for (i = 0; i < lines.length; i++) {
        // begin
        ctx.beginPath();
        // set up gradient canvas
        grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
        switch (lines[i].direction) {
            case "left":
                // set up gradient going from left to right.
                grd.addColorStop(clamp((lines[i].location + lineLength) / canvas.width, 0, 1), color);
                grd.addColorStop(clamp((lines[i].location) / canvas.width, 0, 1), transparentWhite);
                ctx.moveTo(lines[i].location, lines[i].offset);
                ctx.lineTo(lines[i].location + lineLength, lines[i].offset);
                break;
            case "right":
                // set up gradient going from right to left.
                grd.addColorStop(clamp((lines[i].location + lineLength) / canvas.width, 0, 1), transparentWhite);
                grd.addColorStop(clamp((lines[i].location) / canvas.width, 0, 1), color);
                ctx.moveTo(lines[i].location + lineLength, lines[i].offset);
                ctx.lineTo(lines[i].location, lines[i].offset);
                break;
        }
        // apply gradient
        ctx.strokeStyle = grd;
        // end
        ctx.stroke();
    }
}

function moveLine(delta) {

    if (lines.length <= 0) return;

    for (i = 0; i < lines.length; i++) {
        lines[i].location += lines[i].speed * delta;
        lines[i].speed += lines[i].startSpeed * delta;
        if (shouldRemoveLine(i)) {
            lines.splice(i, 1);
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
    return dir == "left" ? (canvas.width + lineLength) : -lineLength;
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

        if (delta != undefined)
            Update(delta);
    }

    requestAnimationFrame(loop);
}

var spawnLineDelay = 0;

function Update(delta) {
    canvas.width = Math.max(document.body.clientWidth, 0);
    canvas.height = Math.max(document.body.clientHeight, window.innerHeight, 0);

    spawnLineDelay -= delta;
    if (spawnLineDelay <= 0) AddNewLine();
    drawLine();
    moveLine(delta);
}

window.onfocus = function () {
    prevTime = undefined;
    isPaused = false;
    AddNewLine();
};

window.onblur = function () {
    prevTime = undefined;
    isPaused = true;
};

function PostBeginScriptRunning() {
    AppendCanvas();
    canvas = document.getElementById("canvas-background");
    ctx = canvas.getContext("2d");
    document.body.style.background = color;
    isInitialized = true;
    AddNewLine();
    requestAnimationFrame(loop);
}

function AppendNavBar(noFade = true) {
    let div = document.createElement("div");
    div.id = "nav";
    div.classList.add("nav-top");
    if (!noFade)
        div.classList.add("fade-in-nav");

    let stringinnerHTML = "";
    let val = navbarURLsMap.length;
    for (i = 0; i < val; i++) {
        stringinnerHTML += '<div class="' + GetIndexClassName(i) + '" ><a href="./' + navbarURLsMap[i].url + '">' + navbarURLsMap[i].name + '</a></div>';
        if (i + 1 == val)
            stringinnerHTML += '</div>';

    }
    stringinnerHTML += '</div>';
    div.innerHTML = stringinnerHTML;
    document.body.insertBefore(div, document.body.firstChild);
}

function GetIndexClassName(indx) {
    
    if (indx == navbarURLsMap.length - 1)
        return "nav-block";
    else
        return "nav-block-end";
}

function AppendCanvas() {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas-background";
    document.body.insertBefore(canvas, document.body.firstChild);
}

function OpenProjectLink(button) {
    window.open(button.title, '_blank');
}

// 🤫😅🤭🙈🙉🙊
function _0x3c5033() {
    return;
    let _0x1d5b15 = "U1RKV2RGbFhiSE09";
    let _0x5bf685 = "WXpKR2RHRlROWHBoUjBaeVlUSTVNV05yUW05aU0xSjBXVmRzYzB4dFRuWmlVVDA5";
    for (let _0x35a4c9 = 0; _0x35a4c9 < 3; _0x35a4c9++) {
        _0x1d5b15 = atob(_0x1d5b15);
        _0x5bf685 = atob(_0x5bf685);
    }
    document.querySelector(_0x1d5b15).innerHTML = "Click Here!";
    document.querySelector(_0x1d5b15).href = "mailto:" + _0x5bf685;
}

PostBeginScriptRunning();