import { z } from "zod";

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

