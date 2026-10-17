import Image from "@11ty/eleventy-img";
import path from "node:path";

function ellipsePoints(count, rx, ry) {
    const steps = 720;
    const point = (t) => ({ x: 600 + rx * Math.cos(t), y: 315 + ry * Math.sin(t) });
    const samples = [{ t: -Math.PI / 2, length: 0 }];
    for (let i = 1; i <= steps; i++) {
        const t = -Math.PI / 2 + (i / steps) * Math.PI * 2;
        const a = point(samples[i - 1].t);
        const b = point(t);
        samples.push({ t, length: samples[i - 1].length + Math.hypot(b.x - a.x, b.y - a.y) });
    }
    const perimeter = samples.at(-1).length;
    return Array.from({ length: count }, (_, i) => {
        const target = ((i + 0.5) / count) * perimeter;
        return point(samples.find((sample) => sample.length >= target).t);
    });
}

function ovalIcons(icons) {
    const size = 88;
    const margin = 40;
    const points = ellipsePoints(icons.length, 600 - margin - size / 2, 315 - margin - size / 2);
    return icons
        .map((icon, i) => {
            const x = points[i].x - size / 2;
            const y = points[i].y - size / 2;
            const viewBox = icon.match(/viewBox="([^"]+)"/)[1];
            const content = icon.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];
            // Slightly tilted around its own center.
            const angle = Math.round((Math.random() * 2 - 1) * 25);
            return (
                `<g transform="rotate(${angle} ${points[i].x} ${points[i].y})">` +
                `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${viewBox}">${content}</svg>` +
                `</g>`
            );
        })
        .join("");
}

// If no preview set, use the title of the page centered on a random dark hue background, `icons` (SVG markup) get placed in an oval around it.
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
    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">` +
            `<rect width="1200" height="630" fill="hsl(${Math.floor(Math.random() * 360)}, 50%, 12.5%)"/>` +
            `<g color="#f8f8ff">${ovalIcons(icons)}</g>` +
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

