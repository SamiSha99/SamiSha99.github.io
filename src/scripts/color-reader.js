var color = {};
let colorPicker = document.getElementById("color-input");

colorPicker.addEventListener('input', onChange, false);

function onChange(event) {
    let c = hexToRGB(event.target.value);
    color = { "R": c[0], "G": c[1], "B": c[2] };
    setBackgroundColor();
}

function readURL() {
    let params = new URLSearchParams(window.location.search);
    let R = params.get("R") ? parseInt(params.get("R")) : 0;
    let G = params.get("G") ? parseInt(params.get("G")) : 0;
    let B = params.get("B") ? parseInt(params.get("B")) : 0;
    colorPicker.value = rgbToHex(R, G, B);
    color = { "R": R, "G": G, "B": B };
    setBackgroundColor();
}

function setBackgroundColor() {
    let background = document.getElementById("colored-background");
    background.style.backgroundColor = "rgb(" + color["R"] + "," + color["G"] + "," + color["B"] + ")";

    let black = getSaturationAverage() > 186 ? "black" : "white";

    let hex = document.getElementById("color-hex");
    hex.style.color = black;
    hex.innerHTML = rgbToHex(color["R"], color["G"], color["B"]);

    let text = document.getElementById("choose-text");
    text.style.color = black;

    let header = document.getElementById("color-header");
    header.style.color = black;
    header.innerHTML = "(" + color["R"] + ", " + color["G"] + ", " + color["B"] + ")";
}

function getSaturationAverage() { return color["R"] * 0.299 + color["G"] * 0.587 + color["B"] * 0.114; }
function hexToRGB(hex, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) { return result ? result.map(i => parseInt(i, 16)).slice(1) : null }
function rgbToHex(r, g, b) { return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); }

readURL();