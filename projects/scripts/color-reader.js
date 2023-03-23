var color = {};

function readURL()
{
    let params = new URLSearchParams(window.location.search);
    let R = params.get("R");
    let G = params.get("G");
    let B = params.get("B");

    if(R == null) R = 255;
    if(G == null) G = 255;
    if(B == null) B = 255;

    console.log("Color picked: [R = " + R + ", G = " + G + ", B = " + B + "]");
    
    color["R"] = R;
    color["G"] = G;
    color["B"] = B;

    setBackgroundColor();
}

function setBackgroundColor()
{
    let background = document.getElementById("colored-background");
    background.style.backgroundColor = "rgb("+ color["R"] + "," + color["G"] + "," + color["B"] + ")";
    let header = document.getElementById("color-header");
    header.style.color = getSaturationAverage() > 128 ? "black" : "white";
    header.innerHTML = "("+ color["R"] + ", " + color["G"] + ", " + color["B"] + ")";
}

function getSaturationAverage()
{
    return color["R"] + color["G"] + color["B"] / 3;
}

readURL();