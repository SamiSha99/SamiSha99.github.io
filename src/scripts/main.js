import { Renderer, Time } from "./game/index.js";

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
window._0x3c5033 = _0x3c5033;

let time;
let renderer;

function startAnimations() {
    if (time) {
        time.start();
        renderer?.time.start();
        if (renderer) renderer.canvas.style.display = "";
        return;
    }

    time = new Time();
    const offsetTime = Math.random() * 360;
    const animationSpeed = 6;
    time.setWorldDilation(animationSpeed);

    window.hue = {
        time,
        offsetTime,
        speed: (n = animationSpeed) => time.setWorldDilation(n),
    };

    function hue() {
        const animationTime = time.currentTime + window.hue.offsetTime;
        document.body.style.setProperty("--default-hue", String(Math.round(animationTime % 360)));
        document.body.style.setProperty(
            "--dash-progress",
            String(((1.25 * animationTime) / 8) % 1),
        );
    }
    hue();

    const Update = () => hue();

    time.update = Update.bind(this);

    if (document.body.getAttribute("no-drawing") !== "true") {
        renderer = new Renderer();
        renderer.run();
    }
}

function stopAnimations() {
    time?.stop();
    renderer?.time.stop();
    if (renderer) renderer.canvas.style.display = "none";
    document.body.style.removeProperty("--default-hue");
    document.body.style.removeProperty("--dash-progress");
}

window.animations = { start: startAnimations, stop: stopAnimations };

// Reduced motion or turned off from the footer.
if (!document.documentElement.classList.contains("no-motion")) startAnimations();

