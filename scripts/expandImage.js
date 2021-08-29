var divShowcase;
var isShowcaseFadingOut, isShowcaseFadingIn;

const clickTimeOut = 320;

function showcaseImage(img) {
    //let imgName = str.substring(str.lastIndexOf("/") + 1, str.length);
    divShowcase = document.createElement("div");
    divShowcase.addEventListener("mousedown", removeImage, false);
    divShowcase.id = "image-showcase";
    divShowcase.classList.add("showcase-img");
    divShowcase.innerHTML += '<img class="showcase-img-scalein" id="shown-img" src="' + img.getAttribute("src") + '" />';
    divShowcase.innerHTML += GetImageDescription(img);
    document.body.insertBefore(divShowcase, document.body.firstChild);
    isShowcaseFadingIn = true;
    setTimeout(
        function () {
            isShowcaseFadingIn = false;
        }, clickTimeOut);
}

function GetImageDescription(img) {
    let str = img.getAttribute("title");
    
    if(IsEmptyOrSpaces(str))
        str = "";
    
    switch(str)
    {
        case null:
        case undefined:
        case "":    
            //console.warn("No description found, " + (img.hasAttribute("title") ? "title specifier has invalid text." : "title was not specified."));
            str = "<i>No description found.</i>";
            break;
    }
    return '<p id="shown-description" class="showcase-img-scalein">' + str + '</p>';
}

function IsEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function removeImage(event) {
    if (divShowcase !== event.target || divShowcase == undefined || isShowcaseFadingOut || isShowcaseFadingIn) return;
    divShowcase.classList.remove("showcase-img-fadein")
    divShowcase.classList.add("showcase-img-fadeout");

    let child = document.getElementById("shown-img");
    child.classList.remove("showcase-img-scalein");
    child.classList.add("showcase-img-scaleout");
    child = document.getElementById("shown-description");
    child.classList.remove("showcase-img-scalein");
    child.classList.add("showcase-img-scaleout");
    
    isShowcaseFadingOut = true;
    
    setTimeout(
        function () {
            divShowcase.innerHTML = '';
            divShowcase.remove();
            isShowcaseFadingOut = false;
            divShowcase = undefined;
        }, clickTimeOut);
}