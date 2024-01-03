// Dear CORS policy: 🖕

// For the navbar
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

// About me star rating skills
skillMap = [
    {name: "OOP", rating: 4.5},
    {name: "C++", rating: 3.5},
    {name: "C#", rating: 4.5},
    {name: "Java", rating: 4.5},
    {name: "Unreal Engine", rating: 4},
    {name: "Unity", rating: 3.5},
    {name: "Web Dev", rating: 4.5},
    {name: "HTML", rating: 5},
    {name: "CSS", rating: 5},
    {name: "JS", rating: 4},
    {name: "React", rating: 4},
    {name: "PHP", rating: 3},
];

// Same as the above but languages
languagesMap = [
    {name: "Arabic (Native)", rating: 5},
    {name: "Hebrew", rating: 3.5},
    {name: "English", rating: 4.5},
    {name: "German (New)", rating: 2}
];

// Info
contactsMap = [
    //{name: "twitter", link:"https://twitter.com/SamiSha_", linkName:"SamiSha_"},
    {name: "github", link:"https://github.com/SamiSha99", linkName:"SamiSha99"},
    {name:"linkedin", link:"https://www.linkedin.com/in/sami-shakkour/", linkName:"sami-shakkour"},
    {name: "youtube", link:"https://www.youtube.com/c/SamiSha", linkName:"SamiSha"}
]

// My work page stuff
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
    // Typer Shark
    {
        name: "Typer Shark",
        p:
        [
            "A mod made for \"Ocean Exploration Modding Jam 2022\", a typing game where you type words on the screen to eliminate sharks before they reach you.",
            "Heavily inspired by a game with the same name, I wanted to make something from my childhood that fits the theme and to test how far I can push mehcnaics I can make, this mod was a blast to create and I would put it one of my favorite projects out there.",
            "Game design, code were made by me, art assets were made by <a target=\"_blank\" href=\"https://twitter.com/habijob\">Habijob</a>, music and sound belong to PopCap."
        ],
        images:
        [
            {src:"typershark/portrait.png", title:"Portrait was made by <a target=\"_blank\" href=\"https://twitter.com/habijob\">Habijob</a>"},
            {src:"typershark/sharks.jpg", title:"Sharks approaching the player!"},
            {src:"typershark/pirahna.jpg", title:"I wish I had \"Pirahana\" meshes just pretend they look like one. :("},
            {src:"typershark/tanky.jpg", title:"Like sharks, but they are blue and take twice the zapping!"},
            {src:"typershark/glowey.jpg", title:"Glowing Sharks have random letters."}
        ]

    },
    // The Relic Trials
    {
        name: "Relic Trials",
        p:
        [
            "A mod in which the player activate global modifiers that impact the game by making it harder, the reward? Just a better score!",
            "Contains 7 modifiers with each of them required to be unlocked by completing the relic relivant to the modifier, relics are unlocked by exploring the game and finding them in hidden spots which when done they unlock a \"rift\", this mod capitalize on this feature by doing minor checks and subsequently applies a flag that unlocks the modifier to be used.",
            "I've wrote around 4 thousand lines of code for the functionality, the animation part of the UI, the UI itself and pretty much everything here."
        ],
        images:
        [
            {src:"relictrials/portrait.png", title:"Portrait of the modd, made by me."},
            {src:"relictrials/stand.jpg", title:"The altar the player can interact with to change their modifiers before loading a level."},
            {src:"relictrials/uisystem.png", title:"Basic UI System (top of the screen)"},
            {src:"relictrials/relic.png", title:"An unlocked relic."},
            {src:"relictrials/locked.png", title:"A locked relic."}
        ]
    },
    // Seasons
    {
        name: "Flower Lake",
        p: 
        [
            "A mod about flowers that increases bounce height after watering them. Including 2 side quests and a secret level.",
            "The secret level is heavily inspired by the Terraria's Mushroom biome, with the mushrooms dancing to the beat of the music."
        ],
        images:
        [
            {src:"seasons/ancient.jpg", title:""},
            {src:"seasons/wettled_flower.jpg", title:"In the center of the dry lake a wilted flower."},
            {src:"seasons/waterball.jpg", title:"Waterball used as an objective to carry on and overcome obstacles."},
            {src:"seasons/mushrooms.jpg", title:"Mushrooms."},
            {src:"seasons/mushroom_cave.jpg", title:"More mushrooms."}
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
    },
    // This Website
    {
        name: "This Website",
        p:
        [
            "I made this website by myself! All the code can be found <a href=\"https://github.com/SamiSha99/SamiSha99.github.io\">here</a>."
        ]
    }
];