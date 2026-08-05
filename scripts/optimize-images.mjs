import sharp from "sharp";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceDir = path.join(root, "image-sources");
const outDir = path.join(root, "public/assets/images");

const RASTER_EXT = /\.(png|jpe?g)$/i;
const MAX_WIDTH = 1280;
const QUALITY = 80;

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (RASTER_EXT.test(entry.name)) yield full;
    }
}

async function needsRebuild(srcPath, outPath) {
    try {
        const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
        return srcStat.mtimeMs > outStat.mtimeMs;
    } catch {
        return true; // output doesn't exist yet
    }
}

let generated = 0;
for await (const srcPath of walk(sourceDir)) {
    const relPath = path.relative(sourceDir, srcPath);
    const outPath = path.join(outDir, relPath.replace(RASTER_EXT, ".webp"));

    if (!(await needsRebuild(srcPath, outPath))) continue;

    await mkdir(path.dirname(outPath), { recursive: true });
    await sharp(srcPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);

    console.log(`[optimize-images] ${relPath} -> ${path.relative(root, outPath)}`);
    generated++;
}

if (generated === 0) {
    console.log("[optimize-images] All images already up to date.");
}

