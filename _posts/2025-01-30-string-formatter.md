---
layout: post
title:  "String Parser"
date:   2025-01-30 09:42:00 +0200
image: /assets/images/blog/string-formatter/thumbnail.png
---

The philosophy behind making a string parser in any programming language using simple index inspection, this type of formatting was done for the [Online Communication](https://github.com/SamiSha99/OnlineCommunication/) Mod which I've released in June 2024. Looking back it, I think its a very rough implementation and there's technically a way WAY better approach than the one I wrote but I think engine limitation was the largest hurdle here of course.

![](/assets/images/blog/string-formatter/thumbnail.png)

For this page, the parser was made in Unreal Engine 3 for A Hat in Time.

## Background

A Hat in Time uses a `HUD` system known as `Hat_HUD` where it renders Objects known as `Hat_HUDElement`, each element handles everything on their side, this is done to make it easier for the developers and modders to add/remove UI content with simple code requests and avoidining overcluttering the `HUD` class rendering everything at once or having a thousands upon thousands lines of code in one file.

Unreal Engine 3 supports text coloring in through changing the Color Channels where you call `SetDrawColor(R,G,B,A?=255);` for the `Canvas` before rendering the text where all inputs take a number between `0 - 255` on the **R**{: style="color:red;"}**G**{: style="color:green;"}**B**{: style="color:blue;"}**A**{: style="color:white;"} channel scale, `A` (alpha) is optional and if not specified its always `255` (so no transparency), e.g. `SetDrawColor(255,0,0)` will set the text **red**{: style="color:red;"}. 

Setting the draw color to a different color will not change the previously drawn text color.

## Limitations

`HUD` in Unreal Engine 3 is purely point coordinates rendering, if I ask it to render "Hello, World!" in position `(X=300, Y=600)` on my screen and "how are you?" in position `(X=330, 600)`, both texts will overlap with the latter text rendered ontop of the former text, so I built a solution where I check textsize and offset it correctly and "as accurately as possible" to make sure it looks right.

Because of this, the HUD doesn't understand what a new line is, this implementation also solves this issue by making a box size where it will break to the next line when its required.

## Prologue

Online Communication is a mod that allows players to write their actions they've done in real time to communicate it better with others, from emoting "over here!" and stickers to pinging spots to tell others in the lobby what they want to do, players cannot directly and literally write into the chat because every Chat Log that is inputted is a localization key which contains references to the text its suppose to render including parameters required to replace.

```ini
[general]
TimePieceGet = [color=#528BFF][color=yellow_lemon][announcer][/color] collected the[icon=TimePiece]for @{~LC|[act_name]}, congratulations![/color]
```

So if the passed localization key is invalid on their clients side, this input is dumped away and never rendered to the client, this is a security protocol to avoid abuse such as the ability to send malicious messages freely. 

This message is parsed to achieve a message that looks beautifully rendered with colors and icons that is clear to other players.

![](/assets/images/blog/string-formatter/debug_message.png)


## Introduction

Essentially the most important part of string parsing finding two points in a string and replace it with different content similar to HTML and Markdown an **opening/closing tag** or a **special tag** (like `<img />` or `<br />`).

First I made 2 structs, the one called `OCLogInfo` containing the Log's information for each message, the other struct `OCSegment` which contains the text, icons, coloring and so on, `OCLogInfo` 

```java
struct OCLogInfo
{
    var String RawText; // Raw unprocessed text
    var Color Color; // Main color
    var Array<OCSegment> Segments;
    var float lifetime; // Time until it fades from the chat
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
    var Color Color; // Segment color
    var bool AddSpace;
    structdefaultproperties
    {
        AddSpace = true;
    }
};
```

## Finding an Opening Tag

Tags are defined as `[tag]` and `[/tag]` similar to HTML or more accurately [BBCode](https://en.wikipedia.org/wiki/BBCode){:target="\_blank"}, we start by looking for an opening tag so we can start our parsing, for this example I supported two types, `[color]` and `[icon]`. 

Both tags work as follows:

Color has a closing tag `[/color]`.
```
[color=red]My red text![/color]
[color=#FFFF00]My Yellow text![/color]
```
But icon doesn't, similar to `<img />`!
```
[icon=TimePiece]
[icon=TimePiece|Amount: 42]
```

To find a tag, we need to find the first index of `[` and `]`, this is where `GetTag()` comes in.

```java
static function string GetTag(coerce string msg, out int start)
{
    local int tagbegin, tagend;
    InStrPeek(msg, tagbegin, "[", start);
    InStrPeek(msg, tagend, "]", start);
    return Mid(msg, tagbegin + 1, tagend - tagbegin - 1);
}
```

`InStrPeek()` is very recurring function call, it takes a message, check if it contains a certain string from the start position (if specified) and returns `true` if valid but also sets 2nd parameter `pos` to the index where `compare` was found.

```java
// Set pos to index of compare if found
// pos = -1 cannot find and also returns false if so
static function bool InStrPeek(string msg, out int pos, const string compare, optional int startpos = 0)
{
    pos = InStr(msg, compare, false, true, Max(startpos, 0));
    return pos != INDEX_NONE;
}
```

When we get the tag content inside `[` and `]`, we need to start finding the cut points for the segment that contains this info by looking for its closing tag if it has one, in this case `[color]` has a closing tag, but `[icon]` doesn't.

In the `FindSegmentCutPoints()` function, we are looking for the closing tag, looking at this again I could have definitely wrote this way better to avoid hardcoding `[color]` and `[icon]` checks to something more organized and better, sorry!

```java
static function bool FindSegmentCutPoints(string msg, out int start, out int end, string compare)
{
    local string compareBreak, rawTag;

    rawTag = compare;
    compare = "["$compare$"]";
    start = -1;
    end = -1;

    InStrPeek(msg, start, compare, start);

    if(InStr(rawTag, "color=", false, true) != INDEX_NONE && class'SS_Color'.static.IsValidColor(Repl(rawTag, "color=", "")))
    {
        compareBreak = "[/color]";
    }
    else if(InStr(rawTag, "icon=", false, true) != INDEX_NONE)
    {
        if(GetIconByName(Repl(rawTag, "icon=", "", false)) == None) return false;
        end = start + Len(compare);
        return true;
    }

    if(start == INDEX_NONE)
    {
        end = INDEX_NONE;
        return false;
    }
    
    end = GetCorrectBreakPointPos(msg, start+1, "[color=", compareBreak);
    
    if(!IsValidTag(rawTag))
    {
        start += Len(compare) + 1;
        return false;
    }
    return true;
}
```

## The Correct Closing Tag

Tags must follow a nesting rules similar to parentheses `()` and brackets `[]`. Say for example `[color][color][/color][/color]` the closing tag for the first `[color]` is the outmost `[/color]` while the 2nd `[color]` closing tag is contained in the innermost `[/color]`.

The solution takes a stack state approach, we have an integer called `stackstate` that starts at `1` because we already found our opening tag, we do the following:

![](/assets/images/blog/string-formatter/stack_example.png)

* When we hit an opening tag we `stackstate++;`.
* When we hit a closing tag we `stackstate--;`.
* Every time an increment or decrement happens we check if `stackstate > 0` if `true` we continue our search.
*  If `stackstate == 0` then we found our closing tag and we can stop searching.

`GetCorrectBreakPointPos()` solves this problem.

```java
// iterates each hit for a start and end tag
// finding a start tag results in increasing the stackstate by 1
// finding an end tag results in decreasing the stackstate by 1
// If we reach 0, we found our end tag position under "formatEndPoint"
// Returns postion of the matching closing tag, returns -1 if it couldn't find it
static function int GetCorrectBreakPointPos(string msg, int startpos, string formatstart, string formatend)
{
    local int stackstate, retries, formatStartPoint, formatEndPoint;
    const MAX_RETRIES = 200;
    
    stackstate = 1;

    while(stackState > 0 && retries < MAX_RETRIES)
    {
        InStrPeek(msg, formatStartPoint, formatstart, startpos);
        InStrPeek(msg, formatEndPoint, formatend,   startpos);

        if(formatEndPoint == INDEX_NONE) break;
        
        if(formatEndPoint < formatStartPoint || formatStartPoint == INDEX_NONE)
        {
            stackState--;
            startPos = formatEndPoint+1;
        }
        else if(formatStartPoint < formatEndPoint && formatStartPoint != INDEX_NONE)
        {
            stackState++;
            startPos = formatStartPoint+1;
        }
        else
            retries++;
    }

    if(retries >= MAX_RETRIES)
    {
        Print("MAX RETRIES REACHED! ABORT!");
    }
    return stackState > 0 ? INDEX_NONE : formatEndPoint;
}
```

With all of these in mind, we make a final function that takes all of these together to create a parser, the parser takes `OCsegment` as its starting inputting, on its first iteration it contains one segment that inside `OCLogInfo` segments array, this segment is repeatedly checked and breaked to more segments until it reaches the end of the string content.

```java
static function bool Parse(OCSegment segment, out Array<OCSegment> segments)
{
    local int start, end, i;
    local string msg, tag;

    msg = segment.Text;
    segments.Length = 0;

    while(i < 50)
    {
        tag = GetTag(msg, start);
        if(!FindSegmentCutPoints(msg, start, end, tag))
        {
            i++;
            continue;
        }
        segments = CutSegments(segment, start, end, tag);
        break;
    }
    
    return Segments.length > 0;
}
```

Because I knew that I wanted to convert a raw string to a `OCLogInfo` type, I've also made another function called `Build()` which turns a raw string to to colorful text and icons.

```java
static function OCLogInfo Build(string msg)
{
    local OCLogInfo l;
    local Array<OCSegment> parseResult; 
    local int i, u;

    l.RawText = msg;
    l.Segments[0] = CreateSegment(l.RawText);
    
    for(i = 0; i < l.Segments.Length; i++)
    {
        if(!Parse(l.Segments[i], parseResult)) continue;
        l.Segments.Remove(i, 1);
        for(u = parseResult.Length - 1; u >= 0; u--) l.Segments.InsertItem(i, parseResult[u]);
        i--;
    }
    return l;
}
```

And there we go! We got a properly set chat message that has all its content when it comes to `[icon]` and `[color]` set correctly! Now all I have to do now is plug it into any program that can show string on your string with all these changes you applied in this string to be parsed into a new!

![](/assets//images/blog/string-formatter/example_result.png){: style="display: block; margin: auto;"}

In this example, you can see the formatting for icons and coloring is working as intended! For emotes its transforming `SamiSha: [color=lime]HI![/color]` and `SamiSha: [color=lime]NOPE![/color]` to their appropriate color! Similar to the icon too!

## Closure

Overall, this taught me a lot about the basics idea of formatting strings to be customized. This is a very basic explanation of it because the project itself has expanded tremendously, it has [dynamic strings](https://github.com/SamiSha99/OnlineCommunication/wiki/Dynamic-Strings), a pre-parse approach that replaces string content dynamically with player variable settings or cross referencing similar text (such as a localization variable) and replacing key defintition that were passed in the lobby correctly in the text before parsing it with the right content.

I hope you found this post at least helpful and informative on this particular subject!