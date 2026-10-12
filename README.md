# sami.shakkour.dev

A personal website to talk about me :), see it here: [https://sami.shakkour.dev/](https://sami.shakkour.dev/)

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:8080

## Adding content

-   **New project:** add an entry to `src/_data/portfolio.json`.
-   **New blog post:** add a Markdown file under `src/blog/<year>/` with `title`, `description` and `date` front matter (the build fails if one is missing).
-   **Images:** put originals in `src/assets/images/`, they are converted to WebP at build time.

## Deploying

Pushing to `master` builds and deploys the site automatically via GitHub Actions.
