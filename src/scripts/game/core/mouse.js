import { Game } from "./game.js";

// Pointer position on the canvas, shared by every entity that reacts to the mouse or touch.
const mouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
    frame: undefined,
    active: false,
};

function moveMouse(clientX, clientY) {
    const canvas = Game.canvas;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = (clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (clientY - rect.top) * (canvas.height / rect.height);
    if (!mouse.active) {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
    }
    mouse.active = true;
}

window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") moveMouse(e.clientX, e.clientY);
});

document.addEventListener("pointerleave", () => (mouse.active = false));

const onTouch = (e) => moveMouse(e.touches[0].clientX, e.touches[0].clientY);
const endTouch = (e) => {
    mouse.active = false;
    if (e.touches.length) onTouch(e);
};
window.addEventListener("touchstart", onTouch, { passive: true });
window.addEventListener("touchmove", onTouch, { passive: true });
window.addEventListener("touchend", endTouch, { passive: true });
window.addEventListener("touchcancel", endTouch, { passive: true });

// Updates the pointer's velocity, once per frame.
function sampleMouse(delta) {
    const frame = Game.instance?.time.currentRealTime;
    if (delta > 0 && frame === mouse.frame) return;
    mouse.frame = frame;
    mouse.vx = delta > 0 ? (mouse.x - mouse.prevX) / delta : 0;
    mouse.vy = delta > 0 ? (mouse.y - mouse.prevY) / delta : 0;
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
}

export { mouse, sampleMouse };
