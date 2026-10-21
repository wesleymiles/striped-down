---
paths:
  - "blog/**"
  - "work-preview/**"
  - "project/**"
  - "art/**"
  - "now/**"
---

# Content authoring conventions

_Keep in sync with `.cursor/rules/content-conventions.mdc`._

## Post types

| Type | Folder | Tags | Layout |
|---|---|---|---|
| Blog post | `blog/{slug}/index.md` | `post` | `blog.liquid` |
| Concert | `blog/concerts/{slug}/index.md` | `post`, `concert` | `blog.liquid` |
| Trip report | `blog/trip-report/{slug}/index.md` | `post`, `trip-report` | `blog.liquid` |
| Art post | `blog/art/{slug}/index.md` | `post`, `art` | `blog.liquid` |
| Tab | `blog/tabs/{slug}/index.md` | `tab` | `tab.liquid` |

Each post lives in its own folder with an `img/` subfolder beside its `index.md`.

## Dates: two dates, two jobs

- `date` is always the **publish** date.
- The **event** date drives ordering and is separate:
  - Concerts → `concerts.event-date`
  - Trip reports → `trips.dateHiked`
- Ordering is handled by `getSortDate` / `sortByEventDate` in `src/taxonomy.js`. Never
  re-sort by publish date manually; you'll desync from the rest of the site.

## Concert front matter

```yaml
layout: blog.liquid
title: "{{ concerts.artist }}"
eleventyComputed:
  description: "@ {{ concerts.venue }}, with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-01-15
concerts:
  event-date: 2016-12-10
  venue: Ritz PDB
  artist:
    - Andy Shauf
    - Chris Cohen
location:
  town: Montreal
  state: Quebec
```

- `concerts.artist` is a plain string for a solo act, an **array** for a bill (headliner
  first).
- `concerts.festival` is optional; when set, `primaryArtist` returns the festival name.
- **Quote numeric artist names in YAML** (`"311"`, not `311`).
- Use the `eleventyComputed` title pattern above for multi-artist bills, not a literal title.

## Trip report front matter

```yaml
layout: blog.liquid
title: Up and back Nebraska Notch trail, and beavers
description: A short shoulder-season hike with the pup
tags:
  - post
  - trip-report
date: 2026-04-03
trips:
  dateHiked: 2026-03-13
  peaks:
    - name: Mt. Mansfield
      elevation: 2162
  distance: 3.0 miles
  temp: 28F° on top
location:
  town: Underhill
  state: Vermont
```

- `title` and `description` are written directly (no computed title).
- `trips.peaks` is an array of `{ name, elevation }` in **feet**; `name` also generates a
  `/peak/{slug}/` URL.
- `trips.temp` is optional. `trips.trail` uses arrows between segments:
  `Frost Trail → Butler Lodge loop`.

## Taxonomy is generated from front matter

Tags, artists, venues, peaks, states, and towns each generate their own URL
(`/blog/tag/{tag}/`, `/artist/{slug}/`, `/venue/{slug}/`, `/peak/{slug}/`,
`/state/{slug}/`, `/town/{slug}/`). Consequences:

- Keep tag spelling consistent — new spellings silently create duplicate archive pages.
- `location.town` / `location.state` also drive those archive pages, so fill them in.
- Existing slugs are hyphenated as stored (`blink-182`, not `Blink 182`). Match existing
  spelling when linking.

## Images

The shortcode is positional and its signature is frozen:

```liquid
{% image "img/filename.jpg", "Descriptive alt for accessibility", "Optional caption" %}
```

Paths are **relative to the post** (`img/...`). Multi-image grid:

```liquid
<div class="grid cols-2 bleed">
{% image "img/a.jpg", "alt", " " %}
{% image "img/b.jpg", "alt", " " %}
</div>
```

- Never invent an image path — the build **throws** on a missing file.
- Rename files with spaces or `&` before referencing them.
- Pass `" "` for the caption when you want none.

## Content rules

- **Do not invent details.** For stubs, 1–3 sentences of real context is better than
  fabricated specifics. Correct front matter matters more than prose length.
- A stub is: complete front matter + a short body. Leave `img/` empty if there are no
  images yet.
- Don't change `layout:`, the folder convention, or the tag set of an existing post while
  doing a styling pass — those are separate concerns from appearance.
- Styling work must not strip `class` attributes from content markup; those classes are the
  hooks the stylesheet depends on.

## Related

A richer authoring workflow (voice, tone, batch backfill, duplicate checks) exists at
`/Users/wes/11ty/.cursor/skills/blog-stubs/SKILL.md`. It only loads when the Cursor
workspace root is `/Users/wes/11ty`, so if you're working in `striped-down/` directly,
read that file explicitly.
