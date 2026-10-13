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

window.blockPage = blockPage;
window.areYouABotQuestionMark = areYouABotQuestionMark;
window.resume = resume;

function openTab(evt, tabId) {
    const contents = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tabs-button");

    contents.forEach((c) => {
        c.style.display = "none";
    });
    buttons.forEach((b) => b.classList.remove("active"));

    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.style.display = "block";
    }

    if (evt) {
        evt.currentTarget.classList.add("active");
    } else {
        document.querySelector(`.tabs-button[onclick*="${tabId}"]`)?.classList.add("active");
    }
}

function initializeTabs() {
    if (document.querySelector(".tabs-button")) {
        openTab(null, "work");
    }
}

window.openTab = openTab;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTabs);
} else {
    initializeTabs();
}

