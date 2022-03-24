const alert = false;

var canvas, ctx, lines = [];

var color = "rgb(120, 81, 169)";
const transparentWhite = "rgba(255, 255, 255, 0.55)";

// When out of focus
var onStartUpTimer, isPaused;
// When Update function is valid.
var isInitialized;
// Attributes
const lineLength = 350,
    lineThickness = 4.5,
    maxSpeed = 2000,
    minSpeed = 1500,
    maxLines = 100;
// Spawn rate
const maxDelayInterval = 0.0875,
    minDelayInterval = 0.0625; // in milliseconds

function AddNewLine() {
    let multiplier = Math.max(canvas.height / 1080 * 1.25, 1);
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
        spawnLineDelay = (1 / multiplier) * randRange(minDelayInterval, maxDelayInterval);
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
    if (spawnLineDelay <= 0)
        AddNewLine();
    drawLine();
    moveLine(delta);
}

window.onfocus = function () {
    prevTime = undefined;
    isPaused = false;
    AddNewLine();
    if (!isInitialized)
        setTimeout(function () {
            onStartUpDelay()
        }, 500);
};

window.onblur = function () {
    prevTime = undefined;
    isPaused = true;
    if (!isInitialized)
        clearTimeout(onStartUpTimer);
};

function PostBeginScriptRunning() {
    let pageName = window.location.pathname.split("/").pop()
    let inHomePage = (pageName == "index.html" || pageName == "");
    let startUpDelay = 0;
    if (alert) {
        switch(pageName)
        {
            case "":
            case "index.html":
                document.body.appendChild(GetAlert("Mobile Not Supported"));
                break;
            case "mywork.html":    
                document.body.appendChild(GetAlert("Page is Work In Progress, terrible on phone!!"));
                break;    
            default:
                break;    
        }
    }

    if (inHomePage) {
        AppendNavBar(false);
        startUpDelay = 2250;
    } else {

        if (pageName == "contact.html")
            _0x3c5033();

        AppendNavBar(true);
    }
    // Set up Canvas
    AppendCanvas();
    canvas = document.getElementById("canvas-background");
    ctx = canvas.getContext("2d");
    document.body.style.background = color;
    onStartUpTimer = setTimeout(function () {
        onStartUpDelay()
    }, startUpDelay);
}

function onStartUpDelay() {
    isInitialized = true;
    AddNewLine();
}

navbarURLsMap = [{
        url: "index.html",
        name: "home"
    },
    {
        url: "about.html",
        name: "about me"
    },
    {
        url: "mywork.html",
        name: "my work"
    },
    {
        url: "contact.html",
        name: "contact me"
    }

];

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

function AppendFooter(noFade = true) {

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

function GetAlert(str = "Mobile Not Supported") {
    let div = document.createElement("div");
    div.classList.add("alert");
    div.classList.add("info-block");
    div.innerHTML = "<p>"+ str +"</p>"
    return div;
}

// 🤫😅🤭🙈🙉🙊
function _0x3c5033() {
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
requestAnimationFrame(loop);