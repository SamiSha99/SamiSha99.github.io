var color = {};
let colorPicker = document.getElementById("color-input");

// colorPicker?.addEventListener("input", updateFirst, false);
colorPicker.addEventListener('input', onChange, false);

function onChange(event) {
    let c = hexToRGB(event.target.value);
    color["R"] = c[0];
    color["G"] = c[1];
    color["B"] = c[2];
    setBackgroundColor();
}

function readURL() {
    let params = new URLSearchParams(window.location.search);
    let R = params.get("R");
    let G = params.get("G");
    let B = params.get("B");

    if (R == null) R = 255;
    if (G == null) G = 255;
    if (B == null) B = 255;

    console.log("Color picked: [R = " + R + ", G = " + G + ", B = " + B + "]");

    color["R"] = R;
    color["G"] = G;
    color["B"] = B;

    setBackgroundColor();
}

function setBackgroundColor() {
    let background = document.getElementById("colored-background");
    background.style.backgroundColor = "rgb(" + color["R"] + "," + color["G"] + "," + color["B"] + ")";
    
    let black = getSaturationAverage() > 186 ? "black" : "white";
    
    let hex = document.getElementById("color-hex");
    hex.style.color = black;
    hex.innerHTML = rgbToHEX(color["R"], color["G"], color["B"])
    
    let header = document.getElementById("color-header");
    header.style.color = black;
    header.innerHTML = "(" + color["R"] + ", " + color["G"] + ", " + color["B"] + ")";
}

function getSaturationAverage() {
    return color["R"]*0.299 + color["G"]*0.587 + color["B"]*0.114;
}

function hexToRGB(hex, result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)) {
    return result ? result.map(i => parseInt(i, 16)).slice(1) : null
}

function rgbToHEX(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

readURL();