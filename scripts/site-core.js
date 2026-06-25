var contentArr = [],
    divShowcaseArr = [],
    darkenDivArr = [];
var expandDiv;
var isShowcaseFadingOut, isShowcaseFadingIn;

const rootStyles = getComputedStyle(document.documentElement);
const raw = rootStyles.getPropertyValue("--showcase-animation-duration").trim();
const clickTimeOut = raw.endsWith("ms") ? parseFloat(raw) : parseFloat(raw) * 1000 * 0.4;

var expandDeepCount = 0;
const ZINDEX_SHOWCASE = 1000;

function blockPage() {
    document.body.innerHTML = `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;text-align:center;">
        <h1>Redirecting...</h1>
    </div>
`;
    setTimeout(() => {
        window.location.href = "https://chatgpt.com/";
    }, 1000);
}

function areYouABotQuestionMark() {
    const divShowcase = createShowcaseElement("showcase-img", "image-showcase");
    divShowcase.innerHTML = `
    <div id="altert-dialog" class="showcase-alert-dialog">
        <div>Are you a Bot?</div>
        <hr/>
        <div style="float:right">
            <a class="button primary" onclick="blockPage()">Yes! ✨</a>
            <a class="button" onclick="_0x3c5033()">No</a>
            <a class="button" onclick="removeContent(event, true)">Cancel</a>
        </div>
    </div>`;
    showcase(divShowcase);
}

function resume() {
    const divShowcase = createShowcaseElement("showcase-img", "image-showcase");
    divShowcase.innerHTML = `
    <div id="altert-dialog" class="showcase-alert-dialog">
        <div>What kind of work are you interested in?</div>
        <hr/>
        <div style="float:right">
            <a class="button" href="./assets/pdf/Sami_Shakkour_Full-Stack.pdf">Full-Stack</a>
            <a class="button" href="./assets/pdf/Sami_Shakkour_Game_Developer.pdf">Game Development</a>
            <a class="button" onclick="removeContent(event, true)">Cancel</a>
        </div>
    </div>`;
    showcase(divShowcase);
}

function showcaseImage(img, isVideo = false, vidIndex = 0) {
    const divShowcase = createShowcaseElement("showcase-img", "image-showcase");
    if (isVideo) {
        const source = img.getElementsByTagName("source");
        const video = img.querySelector("video");
        divShowcase.innerHTML += `<video class="showcase-img-scalein" id="shown-img" controls autoplay="true" ${video.hasAttribute("muted") ? "muted" : ""}> <source src="${source[vidIndex].src}" type="${source[vidIndex].type}" /> </video>`;
        divShowcase.innerHTML += getContentInfo(source, true, vidIndex);
    } else {
        divShowcase.innerHTML +=
            '<img class="showcase-img-scalein" id="shown-img" src="' +
            img.getAttribute("src") +
            '" />';
        divShowcase.innerHTML += getContentInfo(img);
    }
    showcase(divShowcase);
}

function showcase(divShowcase) {
    isShowcaseFadingIn = true;
    const darkenDiv = createShowcaseElement("showcase-darken", "", undefined, -1);
    if (expandDeepCount == 0 || expandDiv == undefined) addExpandingDiv();
    expandDiv.appendChild(darkenDiv);
    expandDiv.appendChild(divShowcase);
    contentArr[expandDeepCount] = { dark: darkenDiv, showcase: divShowcase };
    expandDeepCount++;
    setTimeout(function () {
        isShowcaseFadingIn = false;
    }, clickTimeOut);
}

function createShowcaseElement(className = "", id = "", content = undefined, zIndexOffset = 0) {
    const d = content == undefined ? document.createElement("div") : content;

    if (d.classList.contains(className)) d.classList.remove(className);
    d.classList.add(className);

    d.id = id;
    d.style.zIndex = GetZIndex(zIndexOffset);
    addEvent(d);
    return d;
}

function GetZIndex(offset = 0) {
    return ZINDEX_SHOWCASE * (expandDeepCount + 1) + offset;
}

function getContentInfo(img, isVideo = false, vidIndex = 0) {
    let str = isVideo ? img[vidIndex].getAttribute("data-desc") : img.getAttribute("data-desc");
    if (emptyOrSpaces(str)) str = "";

    switch (str) {
        case null:
        case undefined:
        case "":
            str = "<i>No description found.</i>";
            break;
    }
    return '<p id="shown-description" class="showcase-img-scalein">' + str + "</p>";
}

function addExpandingDiv() {
    expandDiv = document.createElement("div");
    expandDiv.id = "expand-div-content";
    document.body.insertBefore(expandDiv, document.body.firstChild);
    expandDiv = document.getElementById("expand-div-content");
}

function emptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function addEvent(node) {
    node.addEventListener("mousedown", removeContent, false);
}

function removeContent(event, force = false) {
    if (expandDeepCount == 0) return;
    if (isShowcaseFadingOut || isShowcaseFadingIn) return;
    const dark = contentArr[expandDeepCount - 1]["dark"];
    const showcase = contentArr[expandDeepCount - 1]["showcase"];
    if (!force && showcase !== event.target && showcase.contains(event.target)) return;

    expandDeepCount--;

    showcase?.classList.remove("showcase-img-fadein");
    showcase?.classList.add("showcase-img-fadeout");
    dark?.classList.remove("showcase-img-fadein");
    dark?.classList.add("showcase-img-fadeout");

    let child = document.getElementById("shown-img");
    if (child != null) {
        child.classList.remove("showcase-img-scalein");
        child.classList.add("showcase-img-scaleout");
    }

    child = document.getElementById("shown-description");
    if (child != null) {
        child.classList.remove("showcase-img-scalein");
        child.classList.add("showcase-img-scaleout");
    }

    isShowcaseFadingOut = true;

    setTimeout(function () {
        contentArr[expandDeepCount]["showcase"].innerHTML = "";
        contentArr[expandDeepCount]["dark"].innerHTML = "";

        isShowcaseFadingOut = false;

        const divShowcase = contentArr[expandDeepCount]["showcase"];
        const darkenDiv = contentArr[expandDeepCount]["dark"];
        divShowcase.remove();
        darkenDiv.remove();

        contentArr[expandDeepCount]["showcase"] = undefined;
        contentArr[expandDeepCount]["dark"] = undefined;
        contentArr.pop();
        if (expandDeepCount == 0 && expandDiv != undefined) {
            expandDiv.innerHTML = "";
            expandDiv.remove();
        }
    }, clickTimeOut);
}

window.blockPage = blockPage;
window.areYouABotQuestionMark = areYouABotQuestionMark;
window.resume = resume;
window.showcaseImage = showcaseImage;
window.removeContent = removeContent;
window.showcase = showcase;

const ASSETS_CLASS = "expand-assets";
const VIDEO_CLASS = "expand-video";
const CONTENT_TAG = "content";

const START_DIRECTORY = window.location.pathname.includes("/projects/")
    ? window.location.pathname.split("/projects/")[0]
    : window.location.pathname.replace(new RegExp("\/[^/]*$", "gm"), "");
const IMG_DIRECTORY = START_DIRECTORY + "/assets/images/";
const VIDEO_DIRECTORY = START_DIRECTORY + "/assets/videos/";

function createContentSection(content) {
    let newContent = [];
    for (let i = 0; i < content.length; i++) {
        let c = createDiv(content[i].hasAttribute("noClass") ? "" : ASSETS_CLASS);
        if (content[i].hasAttribute("scrollable")) {
            c.classList.add("expand-assets-scrollable");
        }
        let childArr = Array.from(content[i].children);

        childArr.forEach((child) => {
            let res = createContent(child);
            if (res != undefined) c.appendChild(res);
        });
        newContent.push(c);
    }

    return newContent;
}

function createContent(child) {
    switch (child.nodeName) {
        case "PIC":
            return reWriteImage(child);
        case "VID":
            return reWriteVideo(child);
        case "BUT":
            return reWriteButton(child);
        default:
            console.warn("Invalid content being created! Content:", child);
            return undefined;
    }
}

function createDiv(className = "") {
    let div = document.createElement("div");
    if (className != "") div.classList.add(className);
    return div;
}

function reWriteImage(child) {
    let img = document.createElement("img");
    img.setAttribute("onclick", "showcaseImage(this)");
    img.setAttribute("src", IMG_DIRECTORY + child.getAttribute("src"));
    img.setAttribute("data-desc", child.innerHTML);
    img.setAttribute("title", stripHTML(child.innerHTML).replace(/\s+/g, " ").trim());
    return img;
}

function reWriteVideo(child) {
    let video = document.createElement("video");
    let source = document.createElement("source");
    let div = createDiv(VIDEO_CLASS);

    div.setAttribute("onclick", "showcaseImage(this, true)");
    source.setAttribute("src", VIDEO_DIRECTORY + child.getAttribute("src"));
    source.setAttribute("data-desc", child.innerHTML);
    source.setAttribute("title", stripHTML(child.innerHTML).replace(/\s+/g, " ").trim());
    source.setAttribute("type", "video/mp4");
    if (child.hasAttribute("muted")) {
        video.muted = true;
        video.setAttribute("muted", "");
    }
    video.appendChild(source);
    div.appendChild(video);
    div.appendChild(createLabel("video"));
    return div;
}

function reWriteButton(child) {
    let button = document.createElement("button");
    button.style.width = "20vh";
    button.title = child.innerHTML;
    let clickLink =
        'window.open("' + stripHTML(child.innerHTML).replace(/\s+/g, " ").trim() + '", "_blank")';
    button.setAttribute("onclick", clickLink);
    button.innerHTML = child.getAttribute("desc");
    return button;
}

function createLabel(type = "image") {
    const div = document.createElement("div");
    div.classList.add("label-content");
    switch (type) {
        case "image":
            div.innerHTML = '<i class="fas fa-images"></i>';
            break;
        case "video":
            div.innerHTML = '<i class="fas fa-video"></i>';
            break;
    }
    return div;
}

function reWriteHTMLPage() {
    let contentToReplace = document.getElementsByTagName(CONTENT_TAG);
    let newReplacemnet = createContentSection(contentToReplace);

    while (contentToReplace.length > 0) {
        contentToReplace[0].replaceWith(newReplacemnet[0]);
        newReplacemnet.shift();
    }
}

function stripHTML(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

window.reWriteHTMLPage = reWriteHTMLPage;

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

async function renderPortfolio() {
    const root = document.getElementById("portfolio-root");
    if (!root) return;

    try {
        const response = await fetch("./data/portfolio.json");
        if (!response.ok) throw new Error(`Could not load portfolio data: ${response.status}`);

        const data = await response.json();
        const fragment = document.createDocumentFragment();

        (data.tabs || []).forEach((tab) => {
            const section = document.createElement("section");
            section.id = tab.id;
            section.className = "tab-content";
            section.setAttribute("aria-label", tab.label || tab.id);

            (tab.projects || []).forEach((project) => {
                const article = document.createElement("article");
                article.className = "project";

                const title = document.createElement("h2");
                title.textContent = project.title;
                article.appendChild(title);

                if (project.buttons?.length) {
                    const links = document.createElement("div");
                    links.className = "project-links";
                    project.buttons.forEach((button) => {
                        const link = document.createElement("a");
                        link.className = button.className || "button";
                        link.href = button.href;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        link.textContent = button.label;
                        links.appendChild(link);
                    });
                    article.appendChild(links);
                }

                (project.paragraphs || []).forEach((content) => {
                    const paragraph = document.createElement("p");

                    if (typeof content === "string") {
                        const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
                        if (looksLikeHtml) {
                            paragraph.innerHTML = content;
                        } else {
                            paragraph.textContent = content;
                        }
                    } else if (content && typeof content === "object") {
                        if (typeof content.html === "string") {
                            paragraph.innerHTML = content.html;
                        } else if (typeof content.text === "string") {
                            paragraph.textContent = content.text;
                        } else {
                            paragraph.textContent = "";
                        }
                    } else {
                        paragraph.textContent = "";
                    }

                    article.appendChild(paragraph);
                });

                if (project.media?.length) {
                    const content = document.createElement("content");
                    if (project.scrollable) {
                        content.setAttribute("scrollable", "");
                    }

                    project.media.forEach((item) => {
                        const element = document.createElement(item.type === "pic" ? "pic" : "vid");
                        element.setAttribute("src", item.src);
                        element.textContent = item.caption || "";
                        content.appendChild(element);
                    });

                    article.appendChild(content);
                }

                section.appendChild(article);
            });

            fragment.appendChild(section);
        });

        root.innerHTML = "";
        root.appendChild(fragment);
        reWriteHTMLPage();
        openTab(null, "work");
    } catch (error) {
        console.error(error);
        root.innerHTML = '<p class="error-message">Portfolio content could not be loaded.</p>';
    }
}

window.renderPortfolio = renderPortfolio;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initializeTabs();
        renderPortfolio();
        reWriteHTMLPage();
    });
} else {
    initializeTabs();
    renderPortfolio();
    reWriteHTMLPage();
}

reWriteHTMLPage();
