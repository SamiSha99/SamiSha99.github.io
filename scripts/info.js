skillMap = [
    {name: "OOP", rating: 4.5},
    {name: "C++", rating: 3.5},
    {name: "C#/Java", rating: 4.5},
    {name: "Unreal Engine", rating: 4},
    {name: "Unity", rating: 3.5},
    {name: "Web Dev", rating: 4.5},
    {name: "HTML", rating: 5},
    {name: "CSS", rating: 5},
    {name: "JS", rating: 4},
    {name: "PHP", rating: 3},
    {name: "Piano", rating: 3.5},
    {name: "Swimming", rating: 5}
];

languagesMap = [
    {name: "Arabic (Native)", rating: 5},
    {name: "Hebrew", rating: 3},
    {name: "English", rating: 4.5},
    {name: "German (New)", rating: 1}
];

contactsMap = [
    {name: "Twitter", link:"https://twitter.com/SamiSha_", linkName:"SamiSha_"},
    {name: "Discord", tag:"SamiSha#0001"},
    {name: "GitHub", link:"https://github.com/SamiSha99", linkName:"SamiSha99"},
    {name:"LinkedIn", link:"https://www.linkedin.com/in/sami-shakkour/", linkName:"sami-shakkour"},
    {name: "Reddit", link:"https://www.reddit.com/user/SamiSha_", linkName:"SamiSha_"},
    {name: "Twitch", link:"https://www.twitch.tv/samisha_", linkName:"SamiSha_"},
    {name: "YouTube", link:"https://www.youtube.com/c/SamiSha", linkName:"SamiSha"}
]

function AppendSkills() {
    let container = document.getElementById("skills");
    var firstHalf = Math.floor(skillMap.length/2), secondHalf = skillMap.length - firstHalf;
    container.innerHTML += SetUpSkillList(0, firstHalf);
    container.innerHTML += "<div class='vl'></div>";
    container.innerHTML += SetUpSkillList(firstHalf, secondHalf);
}

function AppendLanguages() {
    let container = document.getElementById("languages");
    container.innerHTML += SetUpSkillList(0, languagesMap.length, true);
}

function SetUpSkillList(start, amount, languageMap = false) {
    var innerHTML = "";
    innerHTML += '<div class="skill-list' + (languageMap ? ' languages' : '') +'">';
    for(i = 0; i < amount; i++) {
        innerHTML += '<div class="skill-tab"><div class="skill">' +
        '<p>' + (languageMap ? languagesMap[start + i].name : skillMap[start + i].name) + '</p>' +
        '<div class="skill-star-container">' +
        GetStars((languageMap ?  languagesMap[start + i].rating : skillMap[start + i].rating)) +
        '</div></div></div>'; //star div -> skill -> skill tab
    }
    innerHTML += '</div>'; // skill list
    return innerHTML;
}

function GetStars(rating)
{
    var starinnerHTML = "";
    var filled = Math.floor(rating), empty = 5 - Math.floor(rating);
    var half = (rating % 1 != 0);
    
    if(half) empty--;

    for(f = 0; f < filled; f++)
        starinnerHTML += '<i class="fas fa-star"></i>';

    if(half)
        starinnerHTML += '<i class="fas fa-star-half-alt"></i>';
    
    for(e = 0; e < empty; e++)
        starinnerHTML += '<i class="far fa-star"></i>';
    
    return starinnerHTML;
}

function AppendContactInfo()
{
    let container = document.getElementById("contact");
    container.innerHTML += SetUpContactInfo();
}

function SetUpContactInfo()
{
    var innerHTML = "";
    
    innerHTML += '<div class="skill-list contacts">';

    for(i = 0; i < contactsMap.length; i++) {
        innerHTML += '<div class="skill-tab"><div class="skill"><p>' + contactsMap[i].name + '</p><div class="skill-star-container">'+
        GetRelevantContact(contactsMap[i]) +
        '</div></div></div>'; //link div -> skill -> skill tab
    }
    innerHTML += '</div>'; // skill list
    return innerHTML;
}

function GetRelevantContact(c)
{
    if(c.link != undefined)
        return "<a target='blank_' href='" + c.link + "'>" + c.linkName + "</a>";
    if(c.tag != undefined)
        return c.tag;

    return "Invalid";
}

TryAppending();

function TryAppending()
{
    let pageName = window.location.pathname.split("/").pop();
    
    switch(pageName)
    {
        case "about.html":
            AppendSkills();
            AppendLanguages();
            break;
        case "contact.html":
            AppendContactInfo();
            break;
        default:
            console.warn("We tried to append, but our location was invalid!");
    }
}
