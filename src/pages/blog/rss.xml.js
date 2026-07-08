import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
    const posts = await getCollection("blog");
    return rss({
        title: "Sami Shakkour's Blog",
        description: "Sami's little corner :3",
        site: context.site,
        items: posts
            .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
            .map((post) => ({
                title: post.data.title,
                pubDate: post.data.date,
                link: `/blog/${post.id}/`,
                categories: post.data.categories,
            })),
    });
}
