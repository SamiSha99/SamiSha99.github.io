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
    openTab(null, "work");
}

window.openTab = openTab;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTabs);
} else {
    initializeTabs();
}
