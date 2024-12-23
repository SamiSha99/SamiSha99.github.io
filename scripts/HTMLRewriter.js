// Literally bootleg markdown, that's it.
const ASSETS_CLASS = "expand-assets";
const VIDEO_CLASS = "expand-video";

const CONTENT_TAG = "content";

// pathways
// it works on both local and server!!!
const START_DIRECTORY = window.location.pathname.includes("/projects/") ?
    window.location.pathname.split("/projects/")[0] :
    window.location.pathname.replace(new RegExp("\/[^/]*$", "gm"), "");
const IMG_DIRECTORY = START_DIRECTORY + "/assets/images/";
const VIDEO_DIRECTORY = START_DIRECTORY + "/assets/videos/";

function createContentSection(content) {
    let newContent = [];
    for (let i = 0; i < content.length; i++) {
        let c = createDiv(content[i].hasAttribute("noClass") ? "" : ASSETS_CLASS);
        let childArr = Array.from(content[i].children);

        childArr.forEach(child => {
            let res = createContent(child);
            if (res != undefined)
                c.appendChild(res);
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
            console.warn("Invalid content! Ignoring.");
            return undefined;
    }
}

function createDiv(className = "") {
    let div = document.createElement("div");
    if (className != "")
        div.classList.add(className);
    return div;
}

function reWriteImage(child) {
    let img = document.createElement("img");
    img.setAttribute('onclick', 'showcaseImage(this)');
    img.setAttribute('src', IMG_DIRECTORY + child.getAttribute("src"));
    img.setAttribute('title', child.innerHTML);
    // img.appendChild(createLabel("image"));
    return img;
}

function reWriteVideo(child) {
    let video = document.createElement("video");
    let source = document.createElement("source");
    let div = createDiv(VIDEO_CLASS);

    div.setAttribute('onclick', 'showcaseImage(this, true)');
    source.setAttribute('src', VIDEO_DIRECTORY + child.getAttribute("src"));
    source.setAttribute('title', child.innerHTML);
    source.setAttribute('type', 'video/mp4');
    video.muted = child.hasAttribute('muted');
    video.appendChild(source);
    div.appendChild(video);
    div.appendChild(createLabel("video"));
    return div;
}

function reWriteButton(child) {
    let button = document.createElement("button");
    button.style.width = "20vh";
    button.title = child.innerHTML;
    let clickLink = 'window.open("' + child.innerHTML + '", "_blank")';
    button.setAttribute('onclick', clickLink);
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

reWriteHTMLPage();