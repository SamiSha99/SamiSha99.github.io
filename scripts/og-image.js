import Image from "@11ty/eleventy-img";
import path from "node:path";

// If no preview set, use the title of the page centered on a random dark hue background.
export function titleCard(title) {
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

// The `preview` image (og:image) of the meta link when a page is shared, `source` is the file's path or the `titleCard`.
export async function ogImage(source, data) {
    const stats = await Image(source, {
        widths: [1200],
        formats: ["jpeg"],
        outputDir: path.join(data.eleventy.directories.output, "img"),
        urlPath: "/img/",
    });
    return stats.jpeg[0].url;
}

