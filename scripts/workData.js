workData = [
    // FrostBurn Cliffs
    {
        name: "FrostBurn Cliffs",
        p: 
        [
            "It's considered my \"first big mod\" project, a mod that tries to add environmental mechanics which gives speed, jump boost and powers focused around ice or fire.",
            "The levels are fast paced so the player suppose to utilize these mechanics to overcome the level as fast as possible.",
            "During the development I've made a small <a target=\"_blank\" href=\"https://steamcommunity.com/sharedfiles/filedetails/?id=1964866705\">demo</a> which got a lot of feedback <small><small>(thanks to the challenge road)</small></small>, both positive and negative, the feedback has helped me in improving the main mod itself.",
            "The development had taken a whole year, with a lot of revamps and overhauls trying to get what is right and wrong. The final reception was overwhelmingly positive (98% positive upvotes)."
        ],
        images:
        [
            {src:"frostburn/fbc.jpg", title:""},
            {src:"frostburn/ice.jpg", title:"A small icy cave from the first level."},
            {src:"frostburn/freezing.jpg", title:"Freezing Fog, an ice hazard that slows and damages the player while inside, get out while you can!"},
            {src:"frostburn/lavafalls.jpg", title:"Using the fire power, the player is able to climb lavafalls or run in lava lakes to reach places they cannot!"},
        ],
        videos: []
    },
    // Train Heist
    {
        name: "The Train Heist",
        p: 
        [
            "A mod that was done for the Battle of the Birds Modding Jam 2020.",
            "We were supposed to make content based around one of two figures, the Conductor a wild west director or DJ Grooves a space/pop funk dancing director. During development I was struck with a huge roadblock for a content idea and decided that I will not contribute to the jam.",
            "That was of course... Till I got this shower thought out of nowhere and made this in less than 5 days.",
            "The idea is you are suppose to defeat all the mafias and disarm all bombs, all in 120 seconds without falling off from the train. The concept is that this is a scene being \"recorded\" and you are the star of the show.",
            "A lot of the development here is rather not scripted, I've made some kismet functionality that helped in adjusting a lot of the back end workflow, with a custom voice player for the disarm that goes from 1 - 5.",
            "Bottom line is that, it was a rather fast neat concept idea I've came up with despite saying \"I will not contribute\"."
        ],
        images:
        [
            {src:"trainheist/intro.jpg", title:"Some girl to the rescue!"},
            {src:"trainheist/mafia.jpg", title:"Taunting the heisters."},
            {src:"trainheist/bomb.jpg", title:"Bombs on my Owl Express?!??"},
            {src:"trainheist/mafiagang.jpg", title:"The Cowboy Mafia Gang strikes!"},
        ],
        videos: [
            {src:"train_heist_intro.mp4", poster: "trainheist/intro.jpg", type: "video/mp4", title:"The Train Heist Intro"}
        ]
    },
    // Seasons
    {
        name: "Project Seasons",
        notice: "Currently in development!",
        p: 
        [
            "A mod that tries to create levels based on each Season using a mechanic that tries to fit to its theme!",
            "From flowers filled with vatality when watered, to Falls filled with ancient ruins and... glowing mushrooms? Huh...",
            "There's not much to discuss yet as its still a work in progress! Patience pls! :)"
        ],
        images:
        [
            {src:"seasons/spring.jpg", title:"Spring"},
            {src:"seasons/fall.jpeg", title:"Fall"},
        ],
        videos: []
    }
];

function showContent(contentName)
{
    // get data
    let c = GetContent(contentName);
    if(c == undefined) throw "Could not find the requested content!!!";
    
    // Get the container
    let showcaseContent = document.getElementById("showcasedContent");
    showcaseContent.classList.remove("details-animated");
    
    // Create the section container
    let section = document.createElement("div");
    section.classList.add("info-block-section");

    // Text
    if(c.p.length != 0)
        section.appendChild(GetDetails(c.name, c.p, c.notice));
    
    // Images, videos, assets, etc
    if(c.images != undefined && c.images.length != 0 || c.videos != undefined && c.videos.length != 0)
        section.appendChild(GetAssets(c.images, c.videos));

    // remove content
    showcaseContent.innerHTML = "";
    // keyframe animation
    section.classList.add("details-animated");
    // replace with new content
    showcaseContent.appendChild(section);
    showcaseContent.scrollIntoView();
}

function GetContent(contentName) {
    for(i = 0; i < workData.length; i++) {
        if(workData[i].name == contentName)
            return workData[i];
    }
    return undefined;
}

function GetDetails(name, descriptions, notice) {
    let div = document.createElement("div");
    div.classList.add("info-block-details");
    div.innerHTML += "<h2>" + name + ":</h2>";
    
    if(notice != undefined)
        div.appendChild(GetNotice(notice));

    for(i = 0; i < descriptions.length; i++)
        div.innerHTML += "<p>" + descriptions[i] + "</p>";
    return div.innerHTML != "" ? div : undefined;
}

function GetAssets(images, videos)
{
    let div = document.createElement("div");
    div.classList.add("expand-assets");

    let block;
    for(i = 0; i < images.length; i++)
    {
        block = document.createElement("img");
        block.src = "./images/" + images[i].src;
        block.title = images[i].title;
        block.setAttribute("onclick", "showcaseImage(this)");
        div.appendChild(block);
    }

    if(videos != undefined && videos.length != 0)
    {
        block = document.createElement("div");
        let vid;
        block.classList.add("expand-video");
        block.setAttribute("onclick", "showcaseImage(this, true)");
        for(i = 0; i < videos.length; i++)
        {
            vid = document.createElement("video");
            vid.poster="./images/" + videos[i].poster;
            vid.innerHTML += "<source src=\"./videos/" + videos[i].src + "\" title=\"" + videos[i].title + "\" type=\"" + videos[i].type + "\" />"
            block.appendChild(vid);
            block.appendChild(GetPlayIcon());
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

function GetNotice(notice)
{
    let div = document.createElement("div");
    div.classList.add("p-notice-container");

    let p = document.createElement("p");
    p.classList.add("p-notice")
    p.innerHTML += notice;
    div.appendChild(p)

    return div.innerHTML != "" ? div : undefined;
}