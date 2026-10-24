import { z } from "zod";
import animations from "../src/_data/animations.js";

// Image of a `preview`, .mp4 files use their poster instead.
export const previewSrc = (preview) =>
    /\.mp4$/i.test(preview)
        ? `/assets/videos/${preview.replace(/\.mp4$/i, "_poster.jpg")}`
        : `/assets/images/${preview}`;

// `src` is relative to /assets/images/, or to /assets/videos/ for .mp4 files.
const mediaSchema = z.object({
    src: z.string(),
    caption: z.string().optional(),
});

const postSchema = z.object({
    title: z.string(),
    // Short summary shown on the listing pages and meta description.
    description: z.string(),
    // Listing pages show the newest first.
    date: z.date(),
    // Thumbnail and link preview, same path as a `media` src. If empty it will show `title` instead, `false` disables the link preview.
    preview: z.union([z.string(), z.literal(false)]).optional(),
    categories: z.array(z.string()).optional(),
    buttons: z
        .array(z.object({ label: z.string(), href: z.string(), className: z.string().optional() }))
        .optional(),
    media: z.array(mediaSchema).optional(),
    scrollable: z.boolean().optional(),
    // Background animation, default to snow if not set.
    animation: z.enum(animations).optional(),
});

export default {
    layout: "layouts/post.njk",
    eleventyDataSchema(data) {
        const result = postSchema.safeParse(data);
        if (!result.success) {
            throw new Error(
                `Invalid front matter in ${data.page.inputPath}:\n${z.prettifyError(result.error)}`,
            );
        }
    },
};
