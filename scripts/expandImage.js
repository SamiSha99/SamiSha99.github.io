var contentArr = [],
    divShowcaseArr = [],
    darkenDivArr = [];
var expandDiv;
var isShowcaseFadingOut, isShowcaseFadingIn;

const clickTimeOut = 175;

var expandDeepCount = 0;
const ZINDEX_SHOWCASE = 1000;

function showcaseImage(img, isVideo = false, vidIndex = 0) {
    let divShowcase = CreateShowcaseElement("showcase-img", "image-showcase");
    let darkenDiv = CreateShowcaseElement("showcase-darken", "", undefined, -1);
    if (isVideo) {
        let source = img.getElementsByTagName("source");
        divShowcase.innerHTML += '<video class="showcase-img-scalein" id="shown-img" controls autoplay="true"> <source src="' + source[vidIndex].src + '" type="' + source[vidIndex].type + '" /> </video>'
        divShowcase.innerHTML += GetImageDescription(source, true, vidIndex);
    } else {
        divShowcase.innerHTML += '<img class="showcase-img-scalein" id="shown-img" src="' + img.getAttribute("src") + '" />';
        divShowcase.innerHTML += GetImageDescription(img);
    }
    DoShowcase(darkenDiv,divShowcase);
}

function expandContent() {
    let divShowcase = CreateShowcaseElement("showcase-expanded", "showcase-expanded", document.getElementById("showcasedContent").cloneNode(true), 0)
    let darkenDiv = CreateShowcaseElement("showcase-darken", "", undefined, -1);
    let dsE = divShowcase.getElementsByClassName("expand-icon");
    dsE[0].innerHTML = '';
    dsE[0].remove();
    DoShowcase(darkenDiv,divShowcase);
}

function DoShowcase(darkenDiv, divShowcase) {
    isShowcaseFadingIn = true;
    if (expandDeepCount == 0 || expandDiv == undefined) AddExpanderDiv();
    expandDiv.appendChild(darkenDiv);
    expandDiv.appendChild(divShowcase);
    contentArr[expandDeepCount] = {dark: darkenDiv, showcase: divShowcase};
    expandDeepCount++;
    setTimeout(
        function () {
            isShowcaseFadingIn = false;
        }, clickTimeOut);
}

function CreateShowcaseElement(className = "", id = "", content = undefined, zIndexOffset = 0) {

    let d = content == undefined ? document.createElement("div") : content;

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

function GetImageDescription(img, isVideo = false, vidIndex = 0) {
    let str = isVideo ? img[vidIndex].title : img.getAttribute("title");
    if (IsEmptyOrSpaces(str)) str = "";

    switch (str) {
        case null:
        case undefined:
        case "":
            //console.warn("Could not find description, " + (img.hasAttribute("title") ? "title specifier has invalid text." : "title was not specified."));
            str = "<i>No description found.</i>";
            break;
    }
    return '<p id="shown-description" class="showcase-img-scalein">' + str + '</p>';
}

function AddExpanderDiv() {
    expandDiv = document.createElement("div");
    expandDiv.id = "expand-div-content";
    document.body.insertBefore(expandDiv, document.body.firstChild);
    expandDiv = document.getElementById("expand-div-content"); // always top
}

function IsEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function addEvent(node) {
    node.addEventListener("mousedown", removeContent, false);
}

function removeContent(event) {
    if (expandDeepCount == 0) return;
    if (isShowcaseFadingOut || isShowcaseFadingIn) return;
    if (clickedTagLikelyExpandable(event.target.tagName)) return;
    if (contentArr[expandDeepCount - 1]["dark"] !== event.target && contentArr[expandDeepCount - 1]["showcase"] !== event.target) return;

    expandDeepCount--;

    contentArr[expandDeepCount]["showcase"].classList.remove("showcase-img-fadein")
    contentArr[expandDeepCount]["showcase"].classList.add("showcase-img-fadeout");
    contentArr[expandDeepCount]["dark"].classList.remove("showcase-img-fadein")
    contentArr[expandDeepCount]["dark"].classList.add("showcase-img-fadeout");

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

    setTimeout(
        function () {

            contentArr[expandDeepCount]["showcase"].innerHTML = '';
            contentArr[expandDeepCount]["dark"].innerHTML = '';

            isShowcaseFadingOut = false;

            let divShowcase = contentArr[expandDeepCount]["showcase"];
            let darkenDiv = contentArr[expandDeepCount]["dark"];
            divShowcase.remove();
            darkenDiv.remove();

            contentArr[expandDeepCount]["showcase"] = undefined;
            contentArr[expandDeepCount]["dark"] = undefined;
            contentArr.pop();
            if (expandDeepCount == 0 && expandDiv != undefined) {
                expandDiv.innerHTML = '';
                expandDiv.remove();
            }
        }, clickTimeOut);
}

function clickedTagLikelyExpandable(name) {
    if (name == 'IMG') return true;
    return false;
}