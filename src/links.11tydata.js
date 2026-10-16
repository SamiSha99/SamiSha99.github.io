import { readFileSync } from "node:fs";
import { ogImage, titleCard } from "../scripts/og-image.js";
import links from "./_data/links.js";

// Every used site's icon, once each.
const icons = [...new Set(links.filter((link) => !link.unused).map((link) => link.icon))].map(
    (icon) => readFileSync(`src/_includes/icons/${icon}.svg`, "utf8"),
);

export default {
    eleventyComputed: {
        // Meta link preview image (og:image), the title card with the icons scattered around it.
        image: (data) => ogImage(titleCard(data.title, icons), data),
    },
};
