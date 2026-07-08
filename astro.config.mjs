import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkCustomHeaderId from "remark-custom-header-id";

export default defineConfig({
    site: "https://sami.shakkour.dev",
    integrations: [sitemap()],
    markdown: {
        processor: unified({ remarkPlugins: [remarkCustomHeaderId] }),
    },
});
