# sami.shakkour.dev

A personal website to talk about me :), see it here: [https://sami.shakkour.dev/](https://sami.shakkour.dev/)

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:8080

## Adding content

- **New blog post:** add a Markdown file under `src/blog/<year>/`.
- **New project:** add a Markdown file under `src/porfolio/<tab>/`.
- Both are considered posts with the same parameters (see `scripts/post.js`), can be moved between the two folders as pleased, `title`, `description` and `date` are required (else the build fails if one is missing).
- **Assets:** put them in `public/assets/`, images on pages are shown as resized WebP copies built at build time, clicking one opens the original.

## Deploying

Pushing to `master` builds and deploys the site automatically via GitHub Actions.
