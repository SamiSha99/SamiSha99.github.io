var divShowcaseArr = [], darkenDivArr = [];
var expandDiv;
var isShowcaseFadingOut, isShowcaseFadingIn;

const clickTimeOut = 175;

var expandDeepCount = 0;

function showcaseImage(img, isVideo = false, vidIndex = 0) {
    divShowcase = document.createElement("div");
    divShowcase.id = "image-showcase";
    divShowcase.classList.add("showcase-img");
    if(isVideo) {
        let source = img.getElementsByTagName("source");
        divShowcase.innerHTML += '<video class="showcase-img-scalein" id="shown-img" controls autoplay="true"> <source src="'+ source[vidIndex].src +'" type="' + source[vidIndex].type + '" /> </video>'
        divShowcase.innerHTML += GetImageDescription(source, true, vidIndex);
    }
    else {
        divShowcase.innerHTML += '<img class="showcase-img-scalein" id="shown-img" src="' + img.getAttribute("src") + '" />';
        divShowcase.innerHTML += GetImageDescription(img);
    }

    darkenDiv = document.createElement("div");
    darkenDiv.classList.add("showcase-darken");

    addEvent(darkenDiv);
    addEvent(divShowcase);

    isShowcaseFadingIn = true;
    if(expandDeepCount == 0 || expandDiv == undefined)
        AddExpanderDiv();
    expandDiv.appendChild(darkenDiv);
    expandDiv.appendChild(divShowcase);
    
    darkenDivArr[expandDeepCount] = darkenDiv;
    divShowcaseArr[expandDeepCount] = divShowcase;

    expandDeepCount++;
    setTimeout(
        function () {
            isShowcaseFadingIn = false;
        }, clickTimeOut);
}

function expandContent()
{
    divShowcase = document.getElementById("showcasedContent").cloneNode(true);
    let dsE = divShowcase.getElementsByClassName("expand-icon");
    dsE[0].innerHTML = '';
    dsE[0].remove();
    divShowcase.id = "showcase-expanded";
    // clean up the classes we are gonna replace them entirely
    divShowcase.removeAttribute('class');
    divShowcase.classList.add("showcase-expanded");
    divShowcase.style.zIndex = 2000;
    darkenDiv = document.createElement("div");
    darkenDiv.classList.add("showcase-darken");

    addEvent(darkenDiv);
    addEvent(divShowcase);

    isShowcaseFadingIn = true;

    if(expandDeepCount == 0 || expandDiv == undefined)
        AddExpanderDiv();
    expandDiv.appendChild(darkenDiv);
    expandDiv.appendChild(divShowcase);

    darkenDivArr[expandDeepCount] = darkenDiv;
    divShowcaseArr[expandDeepCount] = divShowcase;
    expandDeepCount++;
    
    setTimeout(
        function () {
            isShowcaseFadingIn = false;
        }, clickTimeOut);
}

function GetImageDescription(img, isVideo = false, vidIndex = 0) {
    let str;
    if(isVideo)
        str = img[vidIndex].title;
    else
        str = img.getAttribute("title");
    
    if(IsEmptyOrSpaces(str))
        str = "";
    
    switch(str)
    {
        case null:
        case undefined:
        case "":    
            console.warn("Could not find description, " + (img.hasAttribute("title") ? "title specifier has invalid text." : "title was not specified."));
            str = "<i>No description found.</i>";
            break;
    }
    return '<p id="shown-description" class="showcase-img-scalein">' + str + '</p>';
}

function AddExpanderDiv()
{
    expandDiv = document.createElement("div");
    expandDiv.id = "expand-div-content";
    document.body.insertBefore(expandDiv, document.body.firstChild); 
    expandDiv = document.getElementById("expand-div-content"); // always top
}

function IsEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function addEvent(node) {
    node.addEventListener("mousedown", removeContent, false);
}

function removeContent(event) {
    if (expandDeepCount == 0) return;
    if (isShowcaseFadingOut || isShowcaseFadingIn) return;
    if (clickedTagLikelyExpandable(event.target.tagName)) return;
    if (darkenDivArr[expandDeepCount - 1] !== event.target && divShowcaseArr[expandDeepCount - 1] !== event.target) return;

    expandDeepCount--;

    divShowcaseArr[expandDeepCount].classList.remove("showcase-img-fadein")
    divShowcaseArr[expandDeepCount].classList.add("showcase-img-fadeout");
    darkenDivArr[expandDeepCount].classList.remove("showcase-img-fadein")
    darkenDivArr[expandDeepCount].classList.add("showcase-img-fadeout");

    let child = document.getElementById("shown-img");
    if(child != null)
    {
        child.classList.remove("showcase-img-scalein");
        child.classList.add("showcase-img-scaleout");
    }

    child = document.getElementById("shown-description");
    if(child != null)
    {
        child.classList.remove("showcase-img-scalein");
        child.classList.add("showcase-img-scaleout");
    }

    isShowcaseFadingOut = true;
    
    setTimeout(
        function () {
            divShowcaseArr[expandDeepCount].innerHTML = '';
            darkenDivArr[expandDeepCount].innerHTML = '';
            isShowcaseFadingOut = false;
            divShowcase = divShowcaseArr[expandDeepCount];
            darkenDiv = darkenDivArr[expandDeepCount];
            divShowcase.remove();
            darkenDiv.remove();
            divShowcaseArr[expandDeepCount] = undefined;
            darkenDivArr[expandDeepCount] = undefined;
            if(expandDeepCount == 0 && expandDiv != undefined)
            {
                expandDiv.innerHTML = '';
                expandDiv.remove();
            }
        }, clickTimeOut);
}

function clickedTagLikelyExpandable(name) {
    if(name == 'IMG') return true;
    return false;
}