import { ogImage, titleCard } from "../../scripts/og-image.js";
import { previewSrc } from "../../scripts/post.js";

export default {
    // Meta link preview image for when sharing the page, this is resized from `preview`.
    // Pages without a preview get a generated (through code) title card, pass `preview: false` to disable it.
    image: (data) => {
        if (data.preview === false || !data.title) return undefined;
        const source = data.preview ? `public${previewSrc(data.preview)}` : titleCard(data.title);
        return ogImage(source, data);
    },
};
