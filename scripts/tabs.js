function openTab(evt, tabId) {
    const contents = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tabs-button");

    contents.forEach(c => c.style.display = "none");
    buttons.forEach(b => b.classList.remove("active"));

    document.getElementById(tabId).style.display = "block";

    if (evt) {
        evt.currentTarget.classList.add("active");
    } else {
        document
            .querySelector(`.tabs-button[onclick*="${tabId}"]`)
            ?.classList.add("active");
    }
}

openTab(null, "work")