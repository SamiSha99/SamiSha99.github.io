import Fetch from "@11ty/eleventy-fetch";

const user = "SamiSha99";
// Repos to exclude
const exclude = ["CipherProject"];

// Pages served on this domain from other repos with GitHub Pages enabled which Eleventy doesn't build them.
// All of them are served under `/<repo>/`, this is cached for a day because we shouldn't spam the API.
export default async function () {
    const headers = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    try {
        const repos = await Fetch(`https://api.github.com/users/${user}/repos?per_page=100`, {
            duration: "1d",
            type: "json",
            fetchOptions: { headers },
        });
        return repos
            .filter((repo) => repo.has_pages && repo.name !== `${user}.github.io`)
            .filter((repo) => !exclude.includes(repo.name))
            .map((repo) => `/${repo.name}/`);
    } catch (error) {
        console.warn(`[externalPages] Couldn't list the GitHub Pages repos: ${error.message}`);
        return [];
    }
}

