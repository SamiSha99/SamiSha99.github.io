---
layout: layouts/base.njk
templateEngineOverride: njk,md
title: Point and Interact
description: An A Hat in Time framework for modding purposes!
chrome: false
media:
    - src: dragexample.mp4
      caption: 'An example of the Framework functionality. <a href="https://bsky.app/profile/elsielcl.bsky.social" target="_blank" rel="noopener noreferrer">Vid by LCL</a>'
    - src: interactionExample.mp4
      caption: 'An example of the Framework functionality. <a href="https://bsky.app/profile/elsielcl.bsky.social" target="_blank" rel="noopener noreferrer">Vid by LCL</a>'
---

{% from "components/media-gallery.njk" import mediaGallery %}

<div id="mainpage" style="margin: auto">

# Point and Interact | v1.1.0

[Repository](https://github.com/SamiSha99/Hat_PAI){.button}
[Download (main.zip)](https://github.com/SamiSha99/Hat_PAI/archive/refs/heads/main.zip){.button}

---

A framework made for modding puporses that allows modders to create point and click interactivity between the player and the world around them. The system is entirely built upon "Hat_HUD" a system found in the game with the addition of interactivity through actors and Kismet functionality. The implementation is quick and simple and allows a lot of customizability through changing the mouse look, colors when Un/Hovering and size. System interacts through "point and click" with "3D button" Actors that the player can drop in the scene and the rest is done through Kismet.

<div style="width: 100%; text-align: center">
<iframe
    style="width: 100%; height: 420; margin: auto"
    src="https://www.youtube-nocookie.com/embed/BfjtglK7Bzk"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
    allowfullscreen></iframe>
</div>

---

## Gallery

{{ mediaGallery(media, false, "Point and Interact Framework gallery video") }}

</div>

