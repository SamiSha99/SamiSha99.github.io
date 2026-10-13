import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAttrs from "markdown-it-attrs";
import { readFileSync } from "node:fs";
import metadata from "./src/_data/metadata.js";

export const config = {
    dir: { input: "src", output: "dist" },
};

const videoIcon = readFileSync("src/_includes/icons/video.svg", "utf8");
let standaloneCount = 0;

// Wrapper link to the original file. This is done so homies don't open preview links and instead open the high res.
// Also points images at `public/`, the image transform resolves absolute `src` paths against `src/`.
function wrapMedia(nodes, skip = false) {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node, i) => {
        if (!node || typeof node !== "object") return;
        const attrs = node.attrs ?? {};
        const src = attrs.src;
        if (node.tag === "img" && src?.startsWith("/assets/") && !("eleventy:ignore" in attrs)) {
            attrs.src = "/../public" + src;
            if (!skip && attrs.alt) nodes[i] = lightboxLink("a", attrs, { href: src }, [node]);
        } else if (node.tag === "video" && src?.startsWith("/assets/videos/") && !skip) {
            const player = `<video controls playsinline${"muted" in attrs ? " muted" : ""} src='${src}'></video>`;
            const poster = src.replace(/\.mp4$/, "_poster.jpg");
            nodes[i] = lightboxLink("div", attrs, { "data-content": player }, [
                {
                    tag: "video",
                    attrs: { "aria-label": attrs["aria-label"] ?? "", preload: "none", poster },
                },
                { tag: "div", attrs: { class: "label-content" }, content: [videoIcon] },
            ]);
        } else {
            wrapMedia(node.content, skip || /^(a|h[1-6])$/.test(node.tag));
        }
    });
}

// Moves the lightbox attributes from the media onto its wrapper, standalone media gets its own gallery.
function lightboxLink(tag, mediaAttrs, attrs, content) {
    const wrapper = { class: "glightbox media-link", ...attrs };
    for (const key of ["title", "style", "data-gallery", "data-description"]) {
        if (key in mediaAttrs) wrapper[key] = mediaAttrs[key];
        delete mediaAttrs[key];
    }
    wrapper["data-gallery"] ??= `media-${++standaloneCount}`;
    return { tag, attrs: wrapper, content };
}

export default function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy({ public: "/" });
    eleventyConfig.addPassthroughCopy("src/scripts");
    eleventyConfig.addPassthroughCopy("src/styles");
    eleventyConfig.addPassthroughCopy({
        "node_modules/prismjs/themes/prism-tomorrow.css": "styles/prism.css",
    });
    eleventyConfig.addPassthroughCopy({
        "node_modules/glightbox/dist/css/glightbox.min.css": "styles/glightbox.css",
    });
    eleventyConfig.addPassthroughCopy({
        "node_modules/glightbox/dist/js/glightbox.min.js": "scripts/glightbox.min.js",
    });

    // Allows `## Heading {#custom-id}` in posts.
    eleventyConfig.amendLibrary("md", (md) =>
        md.use(markdownItAttrs, { allowedAttributes: ["id"] }),
    );

    eleventyConfig.addPlugin(IdAttributePlugin);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    // Do it first before before the image transforming.
    eleventyConfig.htmlTransformer.addPosthtmlPlugin("html", () => (tree) => wrapMedia(tree), {
        priority: 0,
    });
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // A single format keeps plain <img> tags for the gallery layout.
        formats: ["webp"],
        widths: [1280],
        sharpOptions: { animated: true },
        htmlOptions: { imgAttributes: { loading: "lazy", decoding: "async" } },
    });
    eleventyConfig.addPlugin(feedPlugin, {
        type: "rss",
        outputPath: "/blog/rss.xml",
        collection: { name: "posts", limit: 0 },
        metadata: {
            language: metadata.language,
            title: "Sami Shakkour's Blog",
            subtitle: "Sami's little corner :3",
            base: metadata.url,
            author: { name: metadata.author },
        },
    });

    eleventyConfig.addFilter("formatDate", (date) =>
        date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    );
    eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));
}
