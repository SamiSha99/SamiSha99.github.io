var contentArr = [],
    divShowcaseArr = [],
    darkenDivArr = [];
var expandDiv;
var isShowcaseFadingOut, isShowcaseFadingIn;

const clickTimeOut = 125;

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
    }, 1500);
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
        divShowcase.innerHTML +=
            '<video class="showcase-img-scalein" id="shown-img" controls autoplay="true" muted> <source src="' +
            source[vidIndex].src +
            '" type="' +
            source[vidIndex].type +
            '" /> </video>';
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

    // reflow!
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
    expandDiv = document.getElementById("expand-div-content"); // always top
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
