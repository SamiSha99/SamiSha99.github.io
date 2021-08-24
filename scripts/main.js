const beta = true;

var canvas, ctx, lines = [];

var color = "rgb(120, 81, 169)",
    color2 = "rgba(255, 255, 255, 0.55)";

// When out of focus
var timer, timer2, isPaused, isInitialized;
// Attributes
const lineLength = 350,
    lineThickness = 6.5,
    maxSpeed = 1500,
    minSpeed = 500,
    maxLines = 50;
// Spawn rate
const maxDelayInterval = 100,
    minDelayInterval = 70; // in milliseconds

function AddNewLine() {
    var multiplier = Math.max(canvas.height / 1080 * 1.25, 1);
    if (lines.length < Math.round(maxLines * multiplier)) {
        let line = {};
        line.direction = GetDirection(Math.floor(Math.random() * 2));
        line.offset = GetOffSet();
        line.speed = randRange(minSpeed, maxSpeed) * GetSpeedDirection(line.direction);
        line.location = GetLocation(line.direction);

        lines.push({
            direction: line.direction,
            offset: line.offset,
            speed: line.speed,
            startSpeed: line.speed,
            location: line.location,
        });
    }
    timer = setTimeout(function () {
        AddNewLine()
    }, Math.round((1 / multiplier) * randRange(minDelayInterval, maxDelayInterval)));
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
    var grd = undefined;
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
                grd.addColorStop(clamp((lines[i].location) / canvas.width, 0, 1), color2);
                ctx.moveTo(lines[i].location, lines[i].offset);
                ctx.lineTo(lines[i].location + lineLength, lines[i].offset);
                break;
            case "right":
                // set up gradient going from right to left.
                grd.addColorStop(clamp((lines[i].location + lineLength) / canvas.width, 0, 1), color2);
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
    var maxLength = canvas.height;
    var minLength = maxLength / 96;
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
const worldDilation = 1;
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

function Update(delta) {
    canvas.width = document.body.clientWidth;
    canvas.height = GetScrollHeight();
    moveLine(delta);
    drawLine();
}

function GetScrollHeight() {
    var body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

window.onfocus = function () {
    prevTime = undefined;
    isPaused = false;
    clearTimeout(timer);
    AddNewLine();
    if (!isInitialized)
        setTimeout(function () {
            onStartUpDelay()
        }, 500);
};

window.onblur = function () {
    prevTime = undefined;
    isPaused = true;
    clearTimeout(timer);
    if (!isInitialized)
        clearTimeout(timer2);
};

window.onload = function () {

    var pageName = window.location.pathname.split("/").pop()
    var inHomePage = (pageName == "index.html" || pageName == "");

    if (beta) {
        document.body.appendChild(GetBeta());
    }

    if (inHomePage) {
        AppendNavBar(false);
        time = 2750;
    } else {

        if (pageName == "contact.html")
            _0x3c5033();

        AppendNavBar(true);
        time = 0;
    }
    // Set up Canvas
    AppendCanvas();
    canvas = document.getElementById("canvas-background");
    ctx = canvas.getContext("2d");
    document.body.style.background = color;
    timer2 = setTimeout(function () {
        onStartUpDelay()
    }, time);
};

function onStartUpDelay() {
    isInitialized = true;
    AddNewLine();
}

function AppendNavBar(noFade = true) {
    var div = document.createElement("div");
    div.id = "nav";
    if (!noFade)
        div.classList.add("fade-in-nav");
    div.innerHTML = '<div class="nav-container-divider"><div><p>|</p></div><div><a href="./index.html">Home</a></div><div><p>|</p></div><div><a href="./about.html">About Me</a></div><div><p>|</p></div></div><div class="nav-container-divider"><div class="additional-line"><p>|</p></div><div><a href="./mywork.html">My Work</a></div><div><p>|</p></div><div><a href="./contact.html">Contact</a></div><div><p>|</p></div></div>'
    document.body.insertBefore(div, document.body.firstChild);
}

function AppendCanvas() {
    var canvas = document.createElement("canvas");
    canvas.id = "canvas-background";
    document.body.insertBefore(canvas, document.body.firstChild);

}

function GetBeta() {
    var div = document.createElement("div");
    div.classList.add("info-block");
    div.classList.add("beta");
    div.innerHTML = "<p>Content not final</p>"
    return div;
}

// go to hell spam bots!
function _0x3c5033() {
    return; // disabled for now
    let _0x1d5b15 = "U1RKV2RGbFhiSE09";
    let _0x5bf685 = "WXpKR2RHRlROWHBoUjBaeVlUSTVNV05yUW05aU0xSjBXVmRzYzB4dFRuWmlVVDA5";
    let _0x93c7ae = "VkZocloxSlhNV2hoVjNjOQ==";
    for (let _0x35a4c9 = 0; _0x35a4c9 < 3; _0x35a4c9++) {
        _0x1d5b15 = atob(_0x1d5b15);
        _0x5bf685 = atob(_0x5bf685);
        _0x93c7ae = atob(_0x93c7ae);
    }
    document.querySelector(_0x1d5b15).innerHTML = _0x93c7ae;
    document.querySelector(_0x1d5b15).href = "mailto:" + _0x5bf685;
}

requestAnimationFrame(loop);