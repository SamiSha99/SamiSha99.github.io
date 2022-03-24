navbarURLsMap = [{
    url: "index.html",
    name: "home"
},
{
    url: "about.html",
    name: "about me"
},
{
    url: "mywork.html",
    name: "my work"
},
{
    url: "contact.html",
    name: "contact me"
}

];


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
    //{name: "Discord", tag:"SamiSha#0001"},
    {name: "GitHub", link:"https://github.com/SamiSha99", linkName:"SamiSha99"},
    {name:"LinkedIn", link:"https://www.linkedin.com/in/sami-shakkour/", linkName:"sami-shakkour"},
    {name: "Reddit", link:"https://www.reddit.com/user/SamiSha_", linkName:"SamiSha_"},
    {name: "Twitch", link:"https://www.twitch.tv/samisha_", linkName:"SamiSha_"},
    {name: "YouTube", link:"https://www.youtube.com/c/SamiSha", linkName:"SamiSha"}
]

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
        videos: 
        [
            {src:"train_heist_intro.mp4", poster: "trainheist/intro.jpg", type: "video/mp4", title:"The Train Heist Intro", playIcon: true}
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
    },
    // Acceleration Badge
    {
        name: "Acceleration Badge",
        p:
        [
            "A script focused mod which allows the player to equip a badge that modifies the world time (time dilation), causing the environment to become faster and dangerous.",
            "The badge provide the abiltiy to modify the values in the config, granting different modifiers which causes every playthrough to feel different and challenging.",
            "It also has a custom challenge mode for those who want to up it with something slightly more difficult!"
        ],
        images:
        [
            {src:"accelerationbadge/Acceleration_Badge_Icon.png", title:"The badge icon!"},
            {src:"accelerationbadge/hat_kid.png", title:""},
            {src:"accelerationbadge/manor.png", title:"Run."},
            {src:"accelerationbadge/config_menu.png", title:"Configuration Menu"}
        ],
        videos: 
        [
            {src:"acceleration_badge_trailer.mp4", poster: "accelerationbadge/yt_trailer_thumbnail.png", type: "video/mp4", title:"Acceleration Badge 2.0 Trailer", playIcon: false}
        ]
    },
    // Cipher Project
    {
        name: "Cipher Project",
        p:
        [
            "A small encryption that uses Cipher algorithms such as Vernam, MonoAlphabetic or Columnar.",
            "The algorithm runs using pure JavaScript thanks to \"FileReader\" and \"8UintArray\".",
            "You can check the program <a href=\"https://samisha99.github.io/CipherProject/\">here</a>."
        ],
        images:
        [
            {src:"cipherproject/cipher_page.png", title:"The Web Page of the Cipher Project"}
        ]
    },
    // Times Since HotS Pathc
    {
        name: "Time Since HotS Patch",
        p:
        [
            "A website that just shows how much times since the last <a href=\"https://en.wikipedia.org/wiki/Heroes_of_the_Storm\">Heroes of the Storm</a> patch, with a history list.",
            "That's... really all of it, it was a good practice to learn about epoch time as a whole though.",
            "You can give the website a look <a href=\"https://samisha99.github.io/Time-Since-HotS-Patch/\">here</a>."
        ]
    },
    // Web Crawler
    {
        name: "Web Crawler",
        p:
        [
            "An experiment done through the GPU crisis to learn about how Web Crawlers as a whole work.",
            "It was fun and yes I got my GPU during it and no this program didn't help with that :(.",
            "Also made me learn Python.",
            "Check the repository <a href=\"https://github.com/SamiSha99/web-crawler-experiment\">here</a>."
        ]
    }
];