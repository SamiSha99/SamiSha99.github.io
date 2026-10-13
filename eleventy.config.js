import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAttrs from "markdown-it-attrs";
import metadata from "./src/_data/metadata.js";

export const config = {
    dir: { input: "src", output: "dist" },
};

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
    // The image transform resolves absolute `src` paths against the input dir (`src/`),
    // so point `/assets/...` at `public/assets/...` before it runs (higher priority runs first).
    eleventyConfig.htmlTransformer.addPosthtmlPlugin(
        "html",
        () => (tree) =>
            tree.match({ tag: "img" }, (node) => {
                if (node.attrs?.src?.startsWith("/assets/")) node.attrs.src = "/../public" + node.attrs.src;
                return node;
            }),
        { priority: 0 },
    );
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        // A single format keeps plain <img> tags (no <picture> wrapper) for the gallery layout.
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
