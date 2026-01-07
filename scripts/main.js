import { buildCanvas, Drawer, Time } from "./game/drawer.js";

const drawer = new Drawer(buildCanvas());
const time = new Time();
const offsetTime = Math.random() * 360;
window.animationSpeed = 6;
function Update(delta) {
    const animationTime = time.currentTime * window.animationSpeed + offsetTime;
    document.body.style = "--default-hue:" + Math.round(animationTime % 360);
}

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

drawer.run();