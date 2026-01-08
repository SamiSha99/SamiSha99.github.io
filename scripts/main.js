import { buildCanvas, Drawer, Time } from "./game/drawer.js";

const time = new Time();
const offsetTime = Math.random() * 360;
const animationSpeed = 6;
time.setWorldDilation(animationSpeed);

window.hue = {
    time,
    offsetTime,
    speed: (n = animationSpeed) => time.setWorldDilation(n),
};

function hue() {
    const animationTime =
        time.currentTime * window.hue.time.worldDilation + window.hue.offsetTime;
    document.body.style.setProperty(
        "--default-hue",
        String(Math.round(animationTime % 360))
    );
}
hue();

const Update = () => hue();

time.update = Update.bind(this);

function OpenProjectLink(button) {
    window.open(button.title, "_blank");
}

// 🤫😅🤭🙈🙉🙊
function _0x3c5033() {
    let _0x1d5b15 = "U1RKV2RGbFhiSE09";
    let _0x5bf685 =
        "WXpKR2RHRlROWHBoUjBaeVlUSTVNV05yUW05aU0xSjBXVmRzYzB4dFRuWmlVVDA5";
    for (let _0x35a4c9 = 0; _0x35a4c9 < 3; _0x35a4c9++) {
        _0x1d5b15 = atob(_0x1d5b15);
        _0x5bf685 = atob(_0x5bf685);
    }
    window.location.href = "mailto:" + _0x5bf685;
}

const drawer = new Drawer();
drawer.run();
