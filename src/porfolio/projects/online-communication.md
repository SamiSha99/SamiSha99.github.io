---
title: Online Communication
description: "Chatless self-moderated A Hat in Time mod that improves communication between online players."
preview: onlinecommunication/logo.png
order: 3
buttons:
    - label: Repository
      href: https://github.com/SamiSha99/OnlineCommunication/
    - label: Steam Workshop
      href: https://steamcommunity.com/sharedfiles/filedetails/?id=3276508705
    - label: Wiki
      href: https://github.com/SamiSha99/OnlineCommunication/wiki
media:
    - src: onlinecommunication/logo.png
      caption: The official logo of Online Communication Mod.
    - src: self_made_ui_example.mp4
      caption: UI settings specific for the mod.
---

I love games (duh) and talking, if I go into a game you'd find me maximizing the chat and communication features to its core, either through writing, role-playing or using shortcuts to send the message across, I love socializing and engaging into the game's provided features.

<iframe width="100%" height="420" src="https://www.youtube-nocookie.com/embed/oEGaKMGqGH8?si=FdcmH-3BZdn9gIzM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Introduction

A Hat in Time's Online Party has the communication wheel, you hold a button and select a text or a sticker which is then broadcasted to everyone, this system works well, and it does its job as intended.

I wanted to see how far can I improve its features, the easiest would be adding more into the communication wheel and allow people to express more or help cases where people didn't receive the message.

---

## Pinging

When I first started this mod, the first thing I implemented was the pinging part of the mod, when you ping a spot this is broadcasted to everyone in the current map, this ping will hit the first valid target and is broadcasted to everyone in the lobby, the point shows how far the ping is from you, the user's profile and their name.

This ping can attach to targets that move and even sync correctly to the current state of certain objects.

> Syncing? What does that mean?

Online Party doesn't sync everything between players, for example moving platform's position would be different to each player which results in players looking like they are floating in the air. The pings synced to the platforms correct ping spot on each player side.

It's not perfect per-say, but it makes sure players are able to figure out where to go or stand on a platform.

### Desperation

> You are pinging too much, be quiet.

You can ping? Great, try not spamming it because if you do: **You will be timed out both on yours and people's end.**

Desperation is an anti-ping spam system that times you out for pinging frequently, the more you ping, the bigger the timeout.

Every time you ping you add to the mute bucket, each time you ping in a short duration will result in adding more to the mute bucket than the previous ping, the next ping you do that fills the bucket (as in hitting the threshold) will instead time you out until the mute amount gained goes below the threshold.

Timeouts can be long depending on how much you spam, for example if you spam immediately, you have to wait up to 15 seconds before you are able to ping normally without issues of penalty. The mission is to keep very loss but also keep pings meaningful and useful for people who have the mod installed and trying to communicate together.

---

## Chat

The chat is a system that allows to log all communication actions that happened in the current play session, missed a ping? The chat will log it for you!

![The chat can work on players who don't even have the mod installed and will print all their behaviors in readable format](/assets/videos/casual_conversation.mp4)

This is the most complex part of the mod, it contains string formatting, localization reading and rendering every single text correctly, A Hat in Time lacks any text wrapping, so I had to go dirty and build it myself. I've talked about it in depth in my other article [String Parser](/blog/2025/string-formatter/).

Even though it's a chat by design and look, there's a very important part of its design: ++You cannot write to it directly.++

### Pinging

When you ping, your ping's content is sent to everyone else in the lobby, so others know something that might interest them.

### Announcements

The chat will announce achievements you've done throughout the game, from gaining a Time Piece to completing a Death Wish, giving others the ability to see what they are up to.

---

## Moderation and Privacy

It was important to me to make sure this mod respects a lot of concerns when using it, immediately when I was making the chat I was on thin ice to release this because the game developers made an announcement that it's not allowed to make mods where players can write into the chat, so I had to make sure my chat is heavily strict and secure to disallow people from vandalizing the mod.

### Moderation

The chat has a built-in swear filter, it filters up more than 500 different inappropriate words in text and name in case of bad actors.

When pinging, you do not send a raw message with formatting, instead you send a key request, this key will be checked by other user's `ini` files if they have it specified, if they do not, then the key will never render, and the information that comes with it is lost, this is done to avoid cases where players can send whatever they want and makes it difficult for players to hijack and abuse the mod.

Finally, all chat messages except for announcements are only sent if both players are on the same map, for example if a player pings from a different level, this will only be sent to players who are also in that same level.

### Privacy

I added 3 layers of communication levels, these results in changing to whom you send and receive messages to:

- **Public:** The default, you will send and receive all messages from all players.
- **Friends Only:** You will send and receive messages and pings from your Steam friends.
- **Private:** Enter a custom channel name, and only send and receive message from players who are also part of this channel.

---

## Modding Support

This mod allows modders to support it by building translations, adding new pingable items that print into the chat, and change the behavior against pinged spots.

For more information, see the [wiki](https://github.com/SamiSha99/OnlineCommunication/wiki).

---

## Conclusion

This is one of my favorite mods I ever worked on, I learned a lot of about UI rendering, reading strings, coloring and create systems that format text into colorful and helpful information to get their point across.

And doing so without encouraging players to directly write into the chat, made it work its purpose of being a chatless, self moderating mod.
