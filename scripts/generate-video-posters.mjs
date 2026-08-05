import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const videosDir = path.join(root, "public/assets/videos");
const POSTER_SUFFIX = "_poster.jpg";
const SEEK_TIME = "00:00:01";

function posterPathFor(videoPath) {
    return videoPath.replace(/\.mp4$/i, POSTER_SUFFIX);
}

async function needsRebuild(srcPath, outPath) {
    try {
        const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)]);
        return srcStat.mtimeMs > outStat.mtimeMs;
    } catch {
        return true; // output doesn't exist yet
    }
}

function extractFrame(videoPath, outPath) {
    return new Promise((resolve, reject) => {
        const proc = spawn(ffmpegPath.path, [
            "-y",
            "-ss",
            SEEK_TIME,
            "-i",
            videoPath,
            "-frames:v",
            "1",
            "-vf",
            "scale=1280:-1",
            "-q:v",
            "4",
            outPath,
        ]);
        let stderr = "";
        proc.stderr.on("data", (d) => (stderr += d));
        proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited ${code} for ${videoPath}\n${stderr}`));
        });
    });
}

const entries = await readdir(videosDir);
const videoFiles = entries.filter((f) => /\.mp4$/i.test(f));

let generated = 0;
for (const file of videoFiles) {
    const srcPath = path.join(videosDir, file);
    const outPath = posterPathFor(srcPath);

    if (!(await needsRebuild(srcPath, outPath))) continue;

    await extractFrame(srcPath, outPath);
    console.log(`[generate-video-posters] ${file} -> ${path.basename(outPath)}`);
    generated++;
}

if (generated === 0) {
    console.log("[generate-video-posters] All posters already up to date.");
}

