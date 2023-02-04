var shownContentName = "";


function showContent(input) {
    let contentName = input.value;
    // Get the container
    let showcaseContent = document.getElementById("showcasedContent");

    if (contentName == shownContentName && window.innerWidth > 768) {
        scrollIfOutOfSight(showcaseContent);
        return;
    }
    
    let b = document.getElementsByClassName("button-pressed");
    for (i = 0; i < b.length; i++) b[i].classList.remove("button-pressed");

    // get data
    let c = GetContent(contentName);
    if (c == undefined) throw "Could not find the requested content, looked up \"" + contentName + "\"!";

    showcaseContent.classList.remove("details-animated");

    // Create the section container
    let section = document.createElement("div");
    section.classList.add("info-block-section");

    //section.appendChild(GetExpand());

    // Text
    if (c.p.length != 0)
        section.appendChild(GetDetails(c.name, c.p, c.notice));

    // Images, videos, assets, etc
    if (c.images != undefined && c.images.length != 0 || c.videos != undefined && c.videos.length != 0)
        section.appendChild(GetAssets(c.images, c.videos));

    // remove content
    showcaseContent.innerHTML = "";
    // keyframe animation
    section.classList.add("details-animated");
    // replace with new content
    showcaseContent.appendChild(section);

    // save last click (desktop only)
    if(window.innerWidth > 768) shownContentName = contentName;
    

    input.classList.add("button-pressed")

    if(window.innerWidth <= 768)
        expandContent();
    
    scrollIfOutOfSight(showcaseContent);
}

function GetExpand() {
    
    return '<i class="fas fa-expand"></i>';
}

function scrollIfOutOfSight(element) {
    t = document.getElementById("assetsTitle");
    if (t != undefined && !isInViewport(t))
        element.scrollIntoView();
    else
        element.scrollTop = 0;
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function GetContent(contentName) {
    for (i = 0; i < workData.length; i++) {
        if (workData[i].name == contentName)
            return workData[i];
    }
    return undefined;
}

function GetDetails(name, descriptions, notice) {
    let div = document.createElement("div");
    div.classList.add("info-block-details");
    div.innerHTML += "<div class=\"details-title\">" +
     "<div class=\"div-assetTitle\"><h2 id=\"assetsTitle\">" + name.toUpperCase() + "</h2></div>" +
    "<div title=\"Click to expand the content!\" class=\"div-expand-icon expand-icon\" onclick=\"expandContent()\">" + GetExpand() + "</div>" + 
    "</div>";
    if (notice != undefined) div.appendChild(GetNotice(notice));
    let divDesc = document.createElement("div");
    for (i = 0; i < descriptions.length; i++) divDesc.innerHTML += "<p>" + descriptions[i] + "</p>";
    div.appendChild(divDesc);
    return div.innerHTML != "" ? div : undefined;
}

function GetAssets(images, videos) {
    let div = document.createElement("div");
    div.classList.add("expand-assets");

    let block;
    for (i = 0; i < images.length; i++) {
        block = document.createElement("img");
        block.src = "./assets/images/" + images[i].src;
        block.title = images[i].title;
        block.setAttribute("onclick", "showcaseImage(this)");
        div.appendChild(block);
    }

    if (videos != undefined && videos.length != 0) {
        block = document.createElement("div");
        let vid;
        block.classList.add("expand-video");
        block.setAttribute("onclick", "showcaseImage(this, true)");
        for (i = 0; i < videos.length; i++) {
            vid = document.createElement("video");
            vid.poster = "./assets/images/" + videos[i].poster;
            vid.innerHTML += "<source src=\"./assets/videos/" + videos[i].src + "\" title=\"" + videos[i].title + "\" type=\"" + videos[i].type + "\" />"
            block.appendChild(vid);
            //if (videos[i].playIcon != undefined && videos[i].playIcon)
               /// block.appendChild(GetPlayIcon());
        }
        div.appendChild(block);
    }

    return div.innerHTML != "" ? div : undefined;
}

function GetPlayIcon() {
    let i = document.createElement("i");
    i.classList.add("fas");
    i.classList.add("fa-play");
    return i;
}

function GetNotice(notice) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    div.classList.add("p-notice-container");
    p.classList.add("p-notice")
    p.innerHTML += notice;
    div.appendChild(p)
    return div.innerHTML != "" ? div : undefined;
}

function resizeButtonTextToFit() {
    let buttons = document.querySelectorAll(".button-list > button");   
    let minimumHeight = -1;
    
    for(i = 0; i < buttons.length; i++) {
        if(minimumHeight == -1 || minimumHeight > buttons[i].clientHeight) minimumHeight = buttons[i].clientHeight;
    }

    for(i = 0; i < buttons.length; i++) {
        buttons[i].style.fontSize = "1.75vw";
        if(buttons[i].clientHeight > minimumHeight) {
            buttons[i].style.fontSize = (parseFloat(buttons[i].style.fontSize) - 0.25).toString() + "vw"; 
        }
    }
}

// slight fit
resizeButtonTextToFit();