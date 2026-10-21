# striped-down — architecture guardrails

Personal Eleventy site for wescarr.com. Read before changing templates, CSS, config, or
content structure. These are the constraints that fail **silently** when broken.

_Cline mirror: `.clinerules/`. Keep in sync with `.cursor/rules/site-architecture.mdc`._

## Stack

- Eleventy 3.x, **CommonJS** config (`module.exports` in `.eleventy.js`).
- Templates: **Liquid** includes + `markdown-it@13`. No `.njk` files exist despite `njk`
  being listed in `setTemplateFormats`.
- CSS: **hand-written. No framework, no preprocessor, no build step.** `css/main.css` is
  passthrough-copied, as are `js/`, `img/`, `fonts/`. There is no `build:css` script —
  editing `css/main.css` is the whole pipeline.
- Build: `npm start` (`npx eleventy --serve`) / `npm run build`
  (`NODE_ENV=production eleventy`). Netlify runs `npm ci && NODE_ENV=production npx eleventy`.
- Node **20** is pinned (`.nvmrc`, `netlify.toml`). A newer local Node can pass builds that
  behave differently on Netlify.

## Layout topology — memorize this

Only **4 layouts** exist and they cover every content file (**245 total**):

| Layout | Files using it |
|---|---|
| `_includes/blog.liquid` | 117 |
| `_includes/tab.liquid` | 112 |
| `_includes/layout.liquid` | 13 |
| `_includes/layout-work-red-hat-case-study.liquid` | 3 |

Counts drift as content is added. Re-derive with a frontmatter-aware parse rather than
`grep`, which over-counts lines that merely start with `layout:` inside prose or docs.

All four **open** with `{% include '_head.liquid' %}` and **close** with
`{% include '_foot.html' %}`.

→ Global chrome (`<head>`, meta/OG tags, masthead nav, footer) lives in exactly **2 files**.
→ A site-wide visual change is normally a **7-file** change: the 4 layouts + those 2
chrome files + `css/main.css`. Prefer that over bulk content edits.

`_includes/layout-work-project.liquid` is referenced by **nothing** — dead file.

## Hard constraints — do not break these

1. **URLs are computed, not authored.** `.eleventy.js` sets a global `permalink` function
   that slugifies every path segment. **Moving or renaming a content file changes its live
   URL.** Never restructure content directories as a side effect of a redesign. If a
   restructure is genuinely required, raise it as its own decision, with redirects.

2. **The `{% image %}` shortcode signature is FROZEN.**
   `{% image "img/x.jpg", "alt text", "caption" %}` — positional. Used in **79 files**
   (**455 calls**); most of the 245 content files carry no images at all. You may change
   its *body* in `.eleventy.js`, never the order or count of its arguments.

3. **Taxonomy pages are paginated and fail quietly.** `blog/tags.html` plus
   `src/artist.liquid`, `src/venue.liquid`, `src/peak.liquid`, `src/state.liquid`,
   `src/town.liquid` generate one URL per distinct value. Break pagination and you still
   get ~346 pages — just wrong ones. Verify with the URL diff below.

4. **Some assets are wired to exact URLs** in `_head.liquid` / `_foot.html`: `/art/`, `/`,
   `/blog/tag/trip-report/`, `/site-architecture/`, `/blog/expanding-the-site/`,
   `/blog/tag/art/`, `/one-week-logo/`. If a URL changes, these conditionals silently stop
   matching. Check that list before touching permalinks. (`/one-week-logo/` is already in
   `.eleventyignore`, so that branch is dead code — leave it alone.)

5. **`work-preview/` is in `.eleventyignore`** — those pages are NOT generated. Do not
   assume `/work/` or `/work-preview/*` routes exist.

6. **Presentation classes live in content, not just layouts** — e.g.
   `<div class="grid cols-2 bleed">` inside `.md` files. Styling changes may require a
   content audit. Beware that markup is hand-cobbled and inconsistent: both
   `class="x"` and `class ="x"` appear. Any find/replace must tolerate optional
   whitespace, and must not "tidy" stray closing tags (e.g. the unmatched `</ul>` in
   `blog.liquid` and `tab.liquid`) — that shifts layout.

7. **Eleventy does NOT ignore dot-directories.** A bare `.md` file inside one is compiled
   into the site as a real page — `.clinerules/` had to be added to `.eleventyignore` or it
   emitted `_site/.clinerules/<name>/index.html`. If you add tooling config in a new
   dot-directory, ignore it in `.eleventyignore` and re-run the URL diff.

## Verify every change with the URL diff

346 URLs, one command. Run after any template, config, or content-structure change:

```bash
find _site -name '*.html' | sort > /tmp/urls-before.txt
npm run build
find _site -name '*.html' | sort > /tmp/urls-after.txt
diff /tmp/urls-before.txt /tmp/urls-after.txt
```

An **empty diff** means you changed presentation without changing the site's shape. Any
output means you moved, added, or dropped a page — account for every line before
continuing. `npm start` is for visual checks; this diff is for correctness. Do not skip it
because a change "looked like just CSS."

## Git conventions

- **`_site/` is committed to git** (2,700 tracked files) and a build rewrites all of it.
  Never mix generated output with source changes in one commit — commit `_site/`
  separately, or work on a branch and leave it uncommitted. Otherwise the real diff is
  unreviewable.
- Structural change = branch + plan, never a drive-by.

## Dependencies

- `slugify` is pinned **exactly** (`"slugify": "1.6.6"`) because it drives URL slugs via the
  `permalink` function. It transliterates diacritics: `Café` → `cafe`, `Sigur Rós` →
  `sigur-ros`, `Coup d'État` → `coup-detat`. **Do not bump it, and never replace it with a
  hand-rolled function** without diffing slug output — a naive reimplementation yields
  `caf`.
- It must stay in `dependencies` (not `devDependencies`): `.eleventy.js` requires it at
  build time.
- Adding a package: run `npm install --package-lock-only`, then confirm `npm ci --dry-run`
  exits 0. Netlify runs `npm ci`, which **fails hard** when `package.json` and
  `package-lock.json` disagree.
