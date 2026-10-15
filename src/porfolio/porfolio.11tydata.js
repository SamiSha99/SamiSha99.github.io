import { z } from "zod";
import { ogImage, titleCard } from "../../scripts/og-image.js";

// `src` is relative to /assets/images/, or to /assets/videos/ for .mp4 files.
const mediaSchema = z.object({
    src: z.string(),
    caption: z.string().optional(),
});

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
        image: (data) => {
            const source = !data.preview
                ? titleCard(data.title)
                : /\.mp4$/i.test(data.preview)
                  ? `public/assets/videos/${data.preview.replace(/\.mp4$/i, "_poster.jpg")}`
                  : `public/assets/images/${data.preview}`;
            return ogImage(source, data);
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

