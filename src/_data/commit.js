import { execFileSync } from "node:child_process";

// The current commit hte site being built from.
export default function () {
    try {
        const [short, full, date] = execFileSync(
            "git",
            ["log", "-1", "--date=format:%Y-%m-%d-%H:%M:%S", "--format=%h|%H|%cd"],
            { encoding: "utf8" },
        )
            .trim()
            .split("|");
        return { short, full, date };
    } catch {
        return undefined;
    }
}

