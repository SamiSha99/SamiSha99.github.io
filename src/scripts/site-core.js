import { initNudge } from "./nudge.js";

function blockPage() {
    document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;text-align:center;">
        <h1>Redirecting...</h1>
    </div>
`;
    setTimeout(() => {
        window.location.href = "https://chatgpt.com/";
    }, 1500);
}

function areYouABotQuestionMark() {
    document.getElementById("bot-dialog").showModal();
}

function resume() {
    document.getElementById("resume-dialog").showModal();
}

initNudge();

const animationToggle = document.getElementById("animation-toggle");

function updateAnimationToggle() {
    const off = document.documentElement.classList.contains("no-motion");
    const toggle = animationToggle.querySelector("a");
    toggle.textContent = off ? "[ ] animations" : "[x] animations";
    toggle.setAttribute("aria-checked", String(!off));
}

function toggleAnimations() {
    const off = !document.documentElement.classList.contains("no-motion");
    if (off) window.animations.stop();
    else window.animations.start();
    document.documentElement.classList.toggle("no-motion", off);
    if (off) localStorage.setItem("animations", "off");
    else localStorage.removeItem("animations");
    updateAnimationToggle();
}

if (animationToggle && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    animationToggle.remove();
} else if (animationToggle) {
    updateAnimationToggle();
}

document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
});

const lightbox = GLightbox({ selector: ".glightbox", width: "90vw", height: "70vh" });
lightbox.on("slide_changed", () => {
    document.querySelectorAll(".gslide video").forEach((video) => video.pause());
    lightbox.activeSlide.querySelector("video")?.play();
});

// Elements with `data-copy` put their value on the clipboard, `data-copied` swaps the icon to "copied!" for a bit.
document.querySelectorAll("[data-copy]").forEach((element) => {
    const icon = element.querySelector("svg");
    const label = document.createTextNode("copied!");
    element.addEventListener("click", async (event) => {
        event.preventDefault();
        await navigator.clipboard.writeText(element.dataset.copy);
        if (label.isConnected) return;
        icon.replaceWith(label);
        setTimeout(() => label.replaceWith(icon), 1500);
    });
});

window.blockPage = blockPage;
window.areYouABotQuestionMark = areYouABotQuestionMark;
window.resume = resume;
window.toggleAnimations = toggleAnimations;

function openTab(tabId) {
    const panel = document.getElementById(tabId);
    if (!panel?.classList.contains("tab-content")) return false;

    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.display = content === panel ? "block" : "none";
    });
    document.querySelectorAll(".tabs-button").forEach((button) => {
        const active = button.hash === `#${tabId}`;
        button.classList.toggle("active", active);
        if (active) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
    });
    return true;
}

// Switch tabs and update the URL without jumping down to the panel or adding history entries.
document.querySelectorAll(".tabs-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        openTab(button.hash.slice(1));
        history.replaceState(null, "", button.hash);
    });
});

window.addEventListener("hashchange", () => openTab(location.hash.slice(1)));

const firstTab = document.querySelector(".tab-content");
if (firstTab && !openTab(location.hash.slice(1))) openTab(firstTab.id);

