var canvas = document.getElementById("canvas-background");
var ctx = canvas.getContext("2d");
var lines = [];

var color = "rgb(120, 81, 169)";

// When out of focus
var timer, timer2, isPaused, isInitialized;
// Attributes
const lineLength = 375, lineThickness = 6.5, maxSpeed = 15, minSpeed = 7.5;
// Spawn rate
const maxDelayInterval = 100, minDelayInterval = 50; // in milliseconds

function AddNewLine() {

    let line = {};
    
    line.direction = GetDirection(Math.floor(Math.random() * 2));
    line.offset = GetOffSet();
    line.speed = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * GetSpeedDirection(line.direction);
    line.location = GetLocation(line.direction);

    lines.push({
        direction: line.direction,
        offset: line.offset,
        speed: line.speed,
        location: line.location
    });
    timer = setTimeout(function(){AddNewLine()}, Math.random() * (maxDelayInterval - minDelayInterval) + maxDelayInterval);
}

function drawLine() {
    for(i = 0; i < lines.length; i++)
    {
        ctx.beginPath();
        switch(lines[i].direction)
        {
            case "left":
                ctx.moveTo(lines[i].location, lines[i].offset);
                ctx.lineTo(lines[i].location + lineLength, lines[i].offset);
                break;
            case "right":
                ctx.moveTo(lines[i].location + lineLength, lines[i].offset);
                ctx.lineTo(lines[i].location, lines[i].offset);
                break;
        }
        ctx.stroke();
    }
}

function moveLine () {
    for(i = 0; i < lines.length; i++)
    {
        lines[i].location += lines[i].speed;
        if(shouldRemoveLine(i))
        {
            lines.splice(i,1);
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
    return dir == "left" ? (canvas.width + lineLength * 1.25) : -lineLength * 1.25;
}

function GetSpeedDirection(dir) {    
    return dir == "left" ? -1 : 1;
}

function shouldRemoveLine(i) {
    let direction = lines[i].direction;
    let location = lines[i].location;
    if(direction == "left" && location < -lineLength) return true;
    if(direction == "right" && location > canvas.width + lineLength) return true;
    return false;
}

function loop() {

    if(!isPaused) Animate();
    requestAnimationFrame(loop);
}

function Animate() {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    var grd = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grd.addColorStop(0, color);
    grd.addColorStop(0.03, color);
    grd.addColorStop(0.5, "rgba(255, 255, 255, 0.25)");
    grd.addColorStop(0.97, color);
    grd.addColorStop(1, color);
    ctx.strokeStyle = grd;
    ctx.lineWidth = lineThickness;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    moveLine();
    drawLine();
}

window.onfocus = function() {
    isPaused = false;
    clearTimeout(timer);
    AddNewLine();
    if(!isInitialized)
        setTimeout(function(){onStartUpDelay()}, 500);
};
  
window.onblur = function() {
    isPaused = true;
    clearTimeout(timer);
    if(!isInitialized)
       clearTimeout(timer2);
};

window.onload = function() {
    
    var pageName = window.location.pathname.split("/").pop()
    var inHomePage = (pageName == "index.html" || pageName == "");
    
    if(inHomePage)
    {
        time = 2750;
    }
    else
    {
        var element = document.getElementById("nav");
        element.classList.remove("fade-in-nav");
        time = 0;
    }
    document.body.style.background = color;
    timer2 = setTimeout(function(){onStartUpDelay()}, time);
};

function onStartUpDelay()
{
    isInitialized = true;
    AddNewLine();
    requestAnimationFrame(loop);
}
