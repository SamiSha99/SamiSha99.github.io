const beta = true;  

var canvas = document.getElementById("canvas-background");
var ctx = canvas.getContext("2d");
var lines = [];

var color = "rgb(120, 81, 169)", color2 = "rgba(255, 255, 255, 0.5)";

// When out of focus
var timer, timer2, isPaused, isInitialized;
// Attributes
const lineLength = 350,
    lineThickness = 6.5,
    maxSpeed = 12,
    minSpeed = 8,
    maxLines = 70;
// Spawn rate
const maxDelayInterval = 80,
    minDelayInterval = 40; // in milliseconds

function AddNewLine() {
    var multiplier = Math.max(canvas.height/1080 * 1.25, 1);
    if (lines.length < Math.round(maxLines * multiplier)) {
        let line = {};
        line.direction = GetDirection(Math.floor(Math.random() * 2));
        line.offset = GetOffSet();
        line.speed = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * GetSpeedDirection(line.direction);
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
    }, Math.round((1/multiplier) * (Math.random() * (maxDelayInterval - minDelayInterval) + maxDelayInterval)));
}

function clamp(n, min, max) {
    if(min > max)
    {
        let tmp = min;
        min = max;
        max = tmp;
    }
    if(n < min)
        return min;
    if(n > max)
        return max;
    return n;
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
                grd.addColorStop(clamp((lines[i].location + lineLength)/canvas.width, 0, 1), color);
                grd.addColorStop(clamp((lines[i].location)/canvas.width, 0, 1), color2);
                ctx.moveTo(lines[i].location, lines[i].offset);
                ctx.lineTo(lines[i].location + lineLength, lines[i].offset);
                break;
            case "right":
                // set up gradient going from right to left.
                grd.addColorStop(clamp((lines[i].location + lineLength)/canvas.width, 0, 1), color2);
                grd.addColorStop(clamp((lines[i].location)/canvas.width, 0, 1), color);
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

function moveLine() {
    for (i = 0; i < lines.length; i++) {
        lines[i].location += lines[i].speed;
        lines[i].speed += lines[i].startSpeed * 1/60;
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
    return Math.floor(Math.random() * (maxLength - minLength) + minLength);
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

function loop() {

    if (!isPaused) Animate();
    requestAnimationFrame(loop);
}

function Animate() {
    canvas.width = document.body.clientWidth;
    canvas.height = GetScrollHeight();
    moveLine();
    drawLine();
}

function GetScrollHeight()
{
    var body = document.body, html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

window.onfocus = function () {
    isPaused = false;
    clearTimeout(timer);
    AddNewLine();
    if (!isInitialized)
        setTimeout(function () {
            onStartUpDelay()
        }, 500);
};

window.onblur = function () {
    isPaused = true;
    clearTimeout(timer);
    if (!isInitialized)
        clearTimeout(timer2);
};

window.onload = function () {

    var pageName = window.location.pathname.split("/").pop()
    var inHomePage = (pageName == "index.html" || pageName == "");

    if(beta)
    {
        document.body.appendChild(GetBeta());
    }

    if (inHomePage) {
        time = 2750;
    } else {

        if (pageName == "contact.html")
           _0x3c5033();

        var element = document.getElementById("nav");
        element.classList.remove("fade-in-nav");
        time = 0;
    }
    document.body.style.background = color;
    timer2 = setTimeout(function () {
        onStartUpDelay()
    }, time);
};

function onStartUpDelay() {
    isInitialized = true;
    AddNewLine();
    requestAnimationFrame(loop);
}

var lastCheckedRadio;

function handleZoom() {
    if(document.querySelector('input[type="radio"]:checked') == lastCheckedRadio)
    {
        lastCheckedRadio.checked = false;
        lastCheckedRadio = undefined;
    }
    else
        lastCheckedRadio = document.querySelector('input[type="radio"]:checked');
}

function GetBeta()
{
    var div = document.createElement("div");
    div.classList.add("info-block");
    div.classList.add("beta");
    div.innerHTML = "<p>Site Under Construction</p>"
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