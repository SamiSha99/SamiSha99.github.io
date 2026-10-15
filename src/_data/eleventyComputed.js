import { ogImage, titleCard } from "../../scripts/og-image.js";

export default {
    // A page without a `preview` image gets a generated title card as its link preview.
    titleCardImage: (data) =>
        !data.image && data.title ? ogImage(titleCard(data.title), data) : undefined,
};

