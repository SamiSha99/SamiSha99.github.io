---
layout: post
title:  "String Parser"
date:   2025-01-30 09:42:00 +0200
image: /assets/images/blog/string-formatter/thumbnail.png
published: false
---

The philosophy behind making a string parser in any programming language using simple index inspection, this type of formatting was done for the [Online Communication](https://github.com/SamiSha99/OnlineCommunication/) Mod which I've released in June 2024.

![](/assets/images/blog/string-formatter/thumbnail.png)

For this page, the parser was made in Unreal Engine 3 for A Hat in Time.

## Background

A Hat in Time uses a `HUD` system known as `Hat_HUD` where it renders Objects known as `Hat_HUDElement`, each element handles everything on their side, this is done to make it easier for the developers and modders to add/remove UI content with simple code requests and avoidining overcluttering the `HUD` class rendering everything at once or having a thousands upon thousands lines of code in one file.

Unreal Engine 3 supports text coloring in through changing the Color Channels where you call `SetDrawColor(R,G,B,A[?]);` for the `Canvas` before rendering the text where all inputs take a number between `0 - 255` on the **R**{: style="color:red;"}**G**{: style="color:green;"}**B**{: style="color:blue;"}**A**{: style="color:white;"} channel scale, `A` (alpha) is optional and if not specified its always `255` (so no transparency), e.g. `SetDrawColor(255,0,0)` will set the text **red**{: style="color:red;"}. 

Setting the draw color to a different color will not change the previously drawn text color.

## Limitations

`HUD` in Unreal Engine 3 is purely point coordinates rendering, if I ask it to render "hello world" in position `(X=300, Y=600)` on my screen and "how are you?" in position `(X=330, 600)`, both texts will overlap with the latter text rendered ontop of the former text, so I built a solution where I check textsize and offset it correctly and "as accurately as possible" to make sure it looks right.

Because of this, the HUD doesn't understand what a new line is, this implementation also solves this issue by making a box size where it will break to the next line when its required.

## Prologue

Online Communication is a mod that allows players to write their actions they've done in real time to communicate it better with others, from emoting to go "over here!" to pinging spots to tell others in the lobby what they want to do, players cannot directly and literally write into the chat because every Chat Log that is inputted is a localization key which contains references to the text its suppose to render.

```ini
[general]
TimePieceGet = [color=#528BFF][color=yellow_lemon][announcer][/color] collected the[icon=TimePiece]for @{~LC|[act_name]}, congratulations![/color]

[ghostparty]
JoinActPopUp = [color=gold][owner] is heading to @{~LC|>[act_name]|}[/gold];
```

So if the passed localization key is invalid on their clients side, this input is dumped away and never rendered to the client, this is a security protocol to avoid abuse such as the ability to send malicious messages freely.

# Introduction

Essentially the most important part of string parsing finding two points in a string and replace it with different content similar to HTML and Markdown an **opening/closing tag** or a **special tag** (like `<img />` or `<br />`).

First I made 2 structs, the one called `OCLogInfo` containing the Log's information, the other struct `OCSegment` which contains the text, icons, coloring and so on.

```java
struct OCLogInfo
{
    var String RawText;
    var Color Color; // Main color
    var Array<OCSegment> Segments;
    var float lifetime;
    var float shake; // When the message is updated or merged with a duplicate
    var bool isNewLine; // Only true when this log is required to linebreak due to limits
    var int Combo; // How many times this message was casted by the **same** exact user (stops chat log spam)
    structdefaultproperties
    {
        Color = (R=255, G=255, B=255);
        lifetime = 5;
        Combo = 1;
    }
};

struct OCSegment
{
    var string Text;
    var Surface Icon;
    var Color Color;
    var bool AddSpace;
    structdefaultproperties
    {
        AddSpace = true;
    }
};
```
<!-- TO-DO WORK FROM HERE!!! -->

Next we look upon turning a message with formatting rules into correctly separated segments.

When the request is done, a function called BuildChatLog() will be called.
No alt text provided for this image
The Parser

First we turn the message into a segment, that's gonna be holding the whole message with no formats necessary on this one yet.

This segment is then iterated upon in a Parse function, if it returns true, then we have Parse Results, this means the Segment we parsed is no longer necessary and we can safely remove it, these new results are then replaced in its position and we need to parse those results to see if there's any more formatting needed, because of that, we need to go back in the for loop.

If the parse returns false, then no parsing happened and we can safely move on to the next segment (if there's any) to do the same task again until we build our "Chat Log" result.

The Parse function is very simple, it tries to find tags by looking for the first "[" and "]" where also "[" is before "]", which is then put into a function that tries to find the firs tag location, their correct closing tag (if the format allows it) so we can successfully do format nesting correctly.
No alt text provided for this image
The Parse function
Maneuvering the String

We need to go through the string to figure out the correct cutting points to separate them to up to 3 segment results, left, middle and right.

So I made a function that has one purpose, to return me a start and end indexes, those are then passed to cut the string into 1-3 and made into segments depending on their formatting rules.
No alt text provided for this image

InStrPeek() checks if the message contains a string and if it does, start is pushed to the beginning of that comparison if it fails the return result is -1, this function is used a lot to figure out opening and closing tags correctly (which will be discussed further in this article).

Now not every format is the same, some are different and requires further checking, so before I move on, I am checking the validity of the passed color (note that this isn't using "RGB" but names of colors but supporting the former is quite simple too), if it successful we move on, if it fails then we figured out that this format is wrong or incomplete, and it will not be processed, so we can skip this one and look for our next opening tag (assuming is also correct) and use that as the start point in the Parse(), for now lets assume that it was correct, we define our closing tag just in case "[/color]" and move forward to find the "end tag".
Finding the End

Formatting rules reminder is that it follows a similar path to "parentheses" in math, coding and so on. So how do we find our correct closing tag?
No alt text provided for this image

We look at all the formatting tags as "stacks", when you find a "start" increment by 1, when you find an end you subtract, if we had even amount, the value will be 0 which when this happens, we successfully found our correct closing tag, but if the value ends up above 0 and we maneuvered the whole string, then this opening tag has no closure.

Since we already found an opening tag, the value of stacks is 1, the following code accomplish our needed task in finding our end.
No alt text provided for this image

The while loop will keep iterating as long as stackState is above 0, if it reaches 0 then we found our break points, it also checks if there's anymore ending tags as we maneuver the string and thus we break if there's no reason to check for them anymore.

Finally we make sure if stackState is above 0, like we said, it implies that there's no closing tag for this opening and thus it is -1, otherwise we return the correct breaking end point.

Finally, we figured out the breaking point that the Parser will use! I hope this isn't a lot of things to grasp upon because its far more simple than it looks like.
Cutting the Points

Since we found our points that we are going to utilize, time to move to the final part, cutting the segment into multiple segments.
No alt text provided for this image

And with that we apply our formats to those segments, achieving what we wanted, a string made with all our formatting, ready to be utilized into whatever system we've built to render this text.

In my case, this was done as a formatter for an online chat mod I am working on, this system is a tremendous improvement for me because it also allows me to build my own "string script" that can then be used to build the formatting I want to achieve, no need to create functions that does one purpose, it will parse the string and output all the correct colors and icons.

As an example, I added a "notification" color when someone is making a message to me directly (which happens if they were looking at me when this message happened).
No alt text provided for this image
A player replying back to me (SamiSha) is colored yellow.

The code in particular:
No alt text provided for this image
Closure

I've learned a lot about strings with this system, I've used Markdown and HTML as guidance and the result was wonderful to achieve especially with the difficulties this engine (Unreal 3) provides. Ending up solving a problem I don't want to face while making this mod, which is a lot of cluttering functions all making their segments separately and manually, while making it super easy for me and someone else to manage it. 