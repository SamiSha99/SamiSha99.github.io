# samisha99.github.io

A personal website that talks about me, hi there!

Learn more about me at: [https://samisha99.github.io/](https://samisha99.github.io/)

## Development — Running locally with Jekyll

This site is built with Jekyll. To run and test the site locally, use one of the options below.

Prerequisites

-   Ruby (2.7+ recommended) or Docker
-   `bundler` (if using the Gemfile)

Recommended: Using Bundler (uses `Gemfile` in this repo)

```bash
# from the repo root
gem install bundler            # only if bundler is not already installed
bundle install                 # installs the gems listed in the Gemfile
bundle exec jekyll serve --livereload --watch
# open http://localhost:4000
```

If you need a different port (for example 5500):

```bash
bundle exec jekyll serve --livereload --watch --port 5500
```

Alternative: Using Docker (no Ruby install required)

```bash
# from the repo root (Linux / macOS / WSL)
docker run --rm --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:4 jekyll serve --watch --incremental --livereload

# Windows PowerShell (adjust path quoting if needed)
docker run --rm -v ${PWD}:/srv/jekyll -p 4000:4000 -it jekyll/jekyll:4 jekyll serve --watch --incremental --livereload
```

Build the static site to `_site`:

```bash
bundle exec jekyll build -d _site
# then serve the output with a static server if desired, e.g.:
npx http-server _site -p 8080
```
