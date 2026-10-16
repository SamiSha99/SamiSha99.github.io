import Image from "@11ty/eleventy-img";
import path from "node:path";

// For /links/ page
function scatterIcons(icons, title) {
    const padding = 24;
    const placed = [title];
    const overlaps = (a, b) =>
        a.x < b.x + b.width + padding &&
        b.x < a.x + a.width + padding &&
        a.y < b.y + b.height + padding &&
        b.y < a.y + a.height + padding;
    return icons
        .map((icon) => {
            const size = 64 + Math.floor(Math.random() * 48);
            let spot;
            for (let tries = 0; tries < 200; tries++) {
                spot = {
                    x: padding + Math.random() * (1200 - size - padding * 2),
                    y: padding + Math.random() * (630 - size - padding * 2),
                    width: size,
                    height: size,
                };
                if (!placed.some((other) => overlaps(spot, other))) break;
            }
            placed.push(spot);
            const viewBox = icon.match(/viewBox="([^"]+)"/)[1];
            const content = icon.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
            // Slightly tilted around its own center, up to 15 degrees either way.
            const angle = Math.round((Math.random() * 2 - 1) * 25);
            const center = `${spot.x + size / 2} ${spot.y + size / 2}`;
            return (
                `<g transform="rotate(${angle} ${center})">` +
                `<svg x="${spot.x}" y="${spot.y}" width="${size}" height="${size}" viewBox="${viewBox}">${content}</svg>` +
                `</g>`
            );
        })
        .join("");
}

// If no preview set, use the title of the page centered on a random dark hue background, `icons` (SVG markup) get scattered around it.
export function titleCard(title, icons = []) {
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
    // Roughly the area the text covers, a monospace character is about 0.6 of the font size wide.
    const textWidth = Math.max(...lines.map((line) => line.length)) * 72 * 0.6;
    const textBox = {
        x: 600 - textWidth / 2,
        y: top - lineHeight / 2,
        width: textWidth,
        height: lines.length * lineHeight,
    };
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
            `<rect width="1200" height="630" fill="hsl(${Math.floor(Math.random() * 360)}, 50%, 12.5%)"/>` +
            `<g color="#f8f8ff">${scatterIcons(icons, textBox)}</g>` +
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

