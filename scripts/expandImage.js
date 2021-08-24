imageMap = [
    {image:"ice.jpg", text:"Hello this is my all new mod!"},
    {image:"test.jpg", text:"A walk in the park"}
];

var divShowcase;
var isShowcaseFadingOut, isShowcaseFadingIn;

function showcaseImage(img) {
    let str = img.getAttribute("src");
    let imgName = str.substring(str.lastIndexOf("/") + 1, str.length);
    divShowcase = document.createElement("div");
    divShowcase.addEventListener("mousedown", removeImage, false);
    divShowcase.id = "image-showcase";
    divShowcase.classList.add("showcase-img");
    divShowcase.innerHTML += '<img class="showcase-img-scalein" id="shown-img" src="./img/' + imgName + '" />';
    divShowcase.innerHTML += GetImageDescription(imgName);
    document.body.insertBefore(divShowcase, document.body.firstChild);
    isShowcaseFadingIn = true;
    setTimeout(
        function () {
            isShowcaseFadingIn = false;
        }, 375);
}

function GetImageDescription(imgName) {
    for(let i = 0; i < imageMap.length; i++) {
        if(imgName != imageMap[i].image) continue;
        return '<p id="shown-description" class="showcase-img-scalein">' + imageMap[i].text + '</p>';
    }
    return '<p id="shown-description" class="showcase-img-scalein"><i>No description found.</i></p>';
}

function removeImage(event) {
    if (divShowcase !== event.target || divShowcase == undefined || isShowcaseFadingOut || isShowcaseFadingIn) return;
    divShowcase.classList.remove("showcase-img-fadein")
    divShowcase.classList.add("showcase-img-fadeout");
    let img = document.getElementById("shown-img");
    img.classList.remove("showcase-img-scalein");
    img.classList.add("showcase-img-scaleout");
    let desc = document.getElementById("shown-description");
    desc.classList.remove("showcase-img-scalein");
    desc.classList.add("showcase-img-scaleout");
    isShowcaseFadingOut = true;
    setTimeout(
        function () {
            divShowcase.innerHTML = '';
            divShowcase.remove();
            isShowcaseFadingOut = false;
            divShowcase = undefined;
        }, 375);
}