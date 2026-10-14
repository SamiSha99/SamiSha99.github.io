import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAttrs from "markdown-it-attrs";
import { readFileSync } from "node:fs";
import metadata from "./src/_data/metadata.js";
import markdownItIns from "markdown-it-ins/dist/markdown-it-ins.js";

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
            if (!skip && attrs.alt) {
                attrs["data-description"] ??= attrs.alt;
                nodes[i] = lightboxLink("a", attrs, { href: src }, [node]);
            }
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

    eleventyConfig.amendLibrary("md", (md) => {
        // Allows `## Heading {#custom-id}` and `[link](url){.css-class}` in posts.
        md.use(markdownItAttrs, { allowedAttributes: ["id", "class", "target", "rel", "style"] });

        // `![caption](/assets/videos/example.mp4)` renders a <video> instead of an <img>.
        const renderImage = md.renderer.rules.image;
        md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const src = token.attrGet("src") ?? "";
            if (/\.(mp4|webm|mov)$/i.test(src)) {
                const alt = self.renderInlineAsText(token.children, options, env);
                const attrs = token.attrs
                    .filter(([name]) => name !== "alt")
                    .map(([name, value]) => `${name}="${md.utils.escapeHtml(value)}"`)
                    .join(" ");
                return `<video ${attrs} aria-label="${md.utils.escapeHtml(alt)}" data-description="${md.utils.escapeHtml(alt)}"></video>`;
            }
            return renderImage(tokens, idx, options, env, self);
        };

        // An External link will open in a new tab, otherwise with `{target=...}` set.
        const renderLink =
            md.renderer.rules.link_open ??
            ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
        md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
            const link = tokens[idx];
            const href = link.attrGet("href") ?? "";
            if (/^https?:\/\//.test(href) && !href.startsWith(metadata.url)) {
                if (!link.attrGet("target")) link.attrSet("target", "_blank");
                if (!link.attrGet("rel")) link.attrSet("rel", "noopener noreferrer");
            }
            return renderLink(tokens, idx, options, env, self);
        };
    });

    eleventyConfig.amendLibrary("md", (mdLib) => {
        mdLib.use(markdownItIns);
    });

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

    eleventyConfig.addCollection("portfolio", (collectionApi) =>
        collectionApi
            .getFilteredByGlob("./src/porfolio/**/*.md")
            .sort((a, b) => a.data.order - b.data.order),
    );

    eleventyConfig.addFilter("formatDate", (date) =>
        date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    );
    eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));
}
