import Image from "@11ty/eleventy-img";
import path from "node:path";
import { z } from "zod";

// `src` is relative to /assets/images/, or to /assets/videos/ for .mp4 files.
const mediaSchema = z.object({
    src: z.string(),
    caption: z.string().optional(),
});

// For none-preview, use the title centered on a random dark hue background.
function titleCard(title) {
    const escaped = title.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const lines = escaped.split(" ").reduce((lines, word) => {
        const last = lines.at(-1);
        if (last && (last + " " + word).length <= 20) lines[lines.length - 1] = last + " " + word;
        else lines.push(word);
        return lines;
    }, []);
    const lineHeight = 90;
    const top = 315 - ((lines.length - 1) * lineHeight) / 2;
    const text = lines
        .map((line, i) => `<text x="600" y="${top + i * lineHeight}">${line}</text>`)
        .join("");
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
            `<rect width="1200" height="630" fill="hsl(${Math.floor(Math.random() * 360)}, 50%, 12.5%)"/>` +
            `<g fill="#f8f8ff" font-family="monospace" font-size="72" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${text}</g>` +
            `</svg>`,
    );
}

const portfolioSchema = z.object({
    title: z.string(),
    // Short summary shown on home page and meta description.
    description: z.string(),
    // Preview image. If empty it will show `title` instead.
    preview: z.string().optional(),
    // Position within its tab on the home page.
    order: z.number(),
    buttons: z
        .array(z.object({ label: z.string(), href: z.string(), className: z.string().optional() }))
        .optional(),
    media: z.array(mediaSchema).optional(),
    scrollable: z.boolean().optional(),
});

export default {
    layout: "layouts/portfolio.njk",
    permalink: "/portfolio/{{ page.fileSlug }}/",
    eleventyComputed: {
        // The folder a file sits in is its tab on the home page, e.g. porfolio/projects/x.md -> "projects".
        tab: (data) => data.page.filePathStem.split("/")[2],
        // Meta Link preview image (og:image) when sharing the page, resized for `preview`.
        // Pages without a preview get a generated title card instead.
        image: async (data) => {
            const source = !data.preview
                ? titleCard(data.title)
                : /\.mp4$/i.test(data.preview)
                  ? `public/assets/videos/${data.preview.replace(/\.mp4$/i, "_poster.jpg")}`
                  : `public/assets/images/${data.preview}`;
            const stats = await Image(source, {
                widths: [1200],
                formats: ["jpeg"],
                outputDir: path.join(data.eleventy.directories.output, "img"),
                urlPath: "/img/",
            });
            return stats.jpeg[0].url;
        },
    },
    eleventyDataSchema(data) {
        const result = portfolioSchema.safeParse(data);
        if (!result.success) {
            throw new Error(
                `Invalid front matter in ${data.page.inputPath}:\n${z.prettifyError(result.error)}`,
            );
        }
    },
};

