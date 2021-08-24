imageMap = [
    {image:"ice.jpg", text:"Hello this is my all new mod!"},
    {image:"test.jpg", text:"A walk in the park"}
];

var divShowcase;
var isShowcaseFadingOut;

function showcaseImage(img) {
    let str = img.getAttribute("src");
    let imgName = str.substring(str.lastIndexOf("/") + 1, str.length);
    divShowcase = document.createElement("div");
    divShowcase.addEventListener("mousedown", removeImage, false);
    divShowcase.id = "image-showcase";
    divShowcase.classList.add("showcase-img");
    divShowcase.innerHTML += '<img src="./img/' + imgName + '" />';
    divShowcase.innerHTML += GetImageDescription(imgName);
    document.body.insertBefore(divShowcase, document.body.firstChild);

}

function GetImageDescription(imgName) {
    for(let i = 0; i < imageMap.length; i++) {
        if(imgName != imageMap[i].image) continue;
        return "<p>" + imageMap[i].text + "</p>";
    }
    return "<p><i>No description found.</i></p>";
}

function removeImage(event) {
    if (divShowcase !== event.target || divShowcase == undefined || isShowcaseFadingOut) return;
    divShowcase.classList.remove("showcase-img-fadein")
    divShowcase.classList.add("showcase-img-fadeout");
    isShowcaseFadingOut = true;
    setTimeout(
        function () {
            divShowcase.innerHTML = '';
            divShowcase.remove();
            isShowcaseFadingOut = false;
            divShowcase = undefined;
        }, 550);
}