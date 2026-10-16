---
layout: layouts/base.njk
title: Site Map
description: Every page on this website.
---

# Site Map

Contains a map of the site for all pages. Built with [Eleventy](https://www.11ty.dev/) and generated on every build.

The site's source code is also on [GitHub](https://github.com/SamiSha99/SamiSha99.github.io).

{{ collections.all | siteMap }}

