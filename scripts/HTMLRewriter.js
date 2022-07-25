// Literally bootleg markdown, that's it.
const ASSETS_CLASS = "expand-assets";
const VIDEO_CLASS = "expand-video";

const CONTENT_TAG = "content";

// pathways
const START_DIRECTORY = window.location.pathname.split("/projects/")[0];
const IMG_DIRECTORY =  START_DIRECTORY + "/assets/images/";
const VIDEO_DIRECTORY = START_DIRECTORY + "/assets/videos/";

function createContentSection(content) {
    let newContent = [];
    for(let i = 0; i < content.length; i++) {
        let c = createDiv(ASSETS_CLASS);
        let childArr = Array.from(content[i].children);

        childArr.forEach(child => {
            let res = createContent(child);
            if(res != undefined)
                c.appendChild(res);
        });
        newContent.push(c);
        break;
    }

    return newContent;
}

function createContent(child) {
    switch(child.nodeName)
    {
        case "PIC":
            return reWriteImage(child);
        case "VID":
            return reWriteVideo(child);
        default:
            console.warn("Invalid content! Ignoring.");
            return undefined;
    }
}

function createDiv(className = "")
{
    let div = document.createElement("div");
    if(className != "")
        div.classList.add(className);
    return div;
}

function reWriteImage(child) {
    let img = document.createElement("img");
    img.setAttribute('onclick','showcaseImage(this)');
    img.setAttribute('src', IMG_DIRECTORY + child.getAttribute("src"));
    img.setAttribute('title', child.innerHTML);
    return img;
}

function reWriteVideo(child) {
    let video = document.createElement("video");
    let source = document.createElement("source");
    let div = createDiv(VIDEO_CLASS);

    div.setAttribute('onclick','showcaseImage(this, true)');

    source.setAttribute('src', VIDEO_DIRECTORY + child.getAttribute("src"));
    source.setAttribute('title', child.innerHTML);
    source.setAttribute('type', 'video/mp4');

    video.appendChild(source);
    div.appendChild(video);

    return div;
}

function reWriteHTMLPage() {
    let contentToReplace = document.getElementsByTagName(CONTENT_TAG);
    let newReplacemnet = createContentSection(contentToReplace);
    
    for(let i = 0; contentToReplace.length; i++) contentToReplace[i].replaceWith(newReplacemnet[i]);
    
}

reWriteHTMLPage();