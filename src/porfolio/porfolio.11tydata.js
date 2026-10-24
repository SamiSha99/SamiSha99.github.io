import post from "../../scripts/post.js";

export default {
    ...post,
    tags: "portfolio",
    permalink: "/portfolio/{{ page.fileSlug }}/",
    eleventyComputed: {
        // The folder a file sits in is its tab on the home page, e.g. porfolio/projects/x.md -> "projects".
        tab: (data) => data.page.filePathStem.split("/")[2],
    },
};
