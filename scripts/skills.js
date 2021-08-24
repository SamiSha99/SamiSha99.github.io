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
    {name: "PHP", rating: 3}
];

languagesMap = [
    {name: "Arabic (Native)", rating: 5},
    {name: "Hebrew", rating: 3},
    {name: "English", rating: 4.5}
];

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
        innerHTML += '<div class="skill-tab"><div class="skill"><p>' + (languageMap ?  languagesMap[start + i].name : skillMap[start + i].name) + '</p><div class="skill-star-container">';
        innerHTML += GetStars((languageMap ?  languagesMap[start + i].rating : skillMap[start + i].rating));
        innerHTML += '</div></div></div>'; //star div -> skill -> skill tab
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

AppendSkills()
AppendLanguages();