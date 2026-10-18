const DEFAULT_REACH = 75;
const DEFAULT_MAX = 16;

function setNudge(element, x, y) {
    element.style.transform = x || y ? `translate(${x}px, ${y}px)` : "";
}

function nudge(element, event) {
    const rect = element.getBoundingClientRect();
    // Hidden, e.g. inside a closed dialog, so it starts from its place next time it shows up.
    if (!rect.width) return setNudge(element, 0, 0);

    // Measured from where it sits without the nudge, the current (mid transition) translate is taken out so it doesn't jitter.
    const { m41: offsetX, m42: offsetY } = new DOMMatrixReadOnly(
        getComputedStyle(element).transform,
    );
    const dx = rect.left + rect.width / 2 - offsetX - event.clientX;
    const dy = rect.top + rect.height / 2 - offsetY - event.clientY;
    const distance = Math.hypot(dx, dy);

    const reach = Number(element.dataset.nudgeReach) || DEFAULT_REACH;
    const max = Number(element.dataset.nudgeMax) || DEFAULT_MAX;
    if (distance >= reach) return setNudge(element, 0, 0);

    const strength = (1 - distance / reach) * max;
    const [dirX, dirY] = distance > 0 ? [dx / distance, dy / distance] : [1, 0];
    setNudge(element, dirX * strength, dirY * strength);
}

export function initNudge() {
    window.addEventListener("pointermove", (event) => {
        const elements = document.querySelectorAll("[data-nudge]");
        // If is animations are turned off then don't nudge
        if (document.documentElement.classList.contains("no-motion")) {
            elements.forEach((element) => setNudge(element, 0, 0));
            return;
        }
        elements.forEach((element) => nudge(element, event));
    });
}

