import { z } from "zod";

const postSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    categories: z.array(z.string()).optional(),
    image: z.string().optional(),
});

export default {
    layout: "layouts/post.njk",
    tags: "posts",
    eleventyDataSchema(data) {
        const result = postSchema.safeParse(data);
        if (!result.success) {
            throw new Error(`Invalid front matter in ${data.page.inputPath}:\n${z.prettifyError(result.error)}`);
        }
    },
};
