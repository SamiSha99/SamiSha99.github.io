---
layout: layouts/base.njk
title: Site Map
description: Every page, image, video and audio file on this website.
---

# Site Map

This contains a map of the site for all pages and media. Built with [Eleventy](https://www.11ty.dev/) and generated on every build.

As always, the site source is on [GitHub](https://github.com/SamiSha99/SamiSha99.github.io).

{{ collections.all | siteMap }}

