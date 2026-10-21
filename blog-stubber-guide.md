# Blog Stubber (`scaffold-post.js`)

Zero-network, zero-AI CLI that scaffolds a hike or concert post from a folder of photos: reads EXIF for dates, copies + renames images, writes matching frontmatter. Lives in `blog-stubbing/`, writes into the sibling `striped-down/blog/`.

## Setup (one-time)

```bash
cd blog-stubbing
npm init -y
npm install exiftool-vendored fs-extra fast-glob
```

## Basic pattern

```bash
node scaffold-post.js <hike|concert> --source <photo-folder> --slug <slug> [options] [--dry-run]
```

Always try `--dry-run` first — it prints the frontmatter and file plan without writing anything. Re-running on an existing slug is refused (duplicate guard), so nothing gets clobbered by accident.

---

## Hike (trip report)

```bash
node scaffold-post.js hike \
  --source trip-report-raw/butler-lodge \
  --slug butler-lodge-loop \
  --peak "Mt. Mansfield:3015" \
  --trail "Stevensville trailhead → Butler Lodge → Long Trail → Nebraska Notch" \
  --town Underhill \
  --state Vermont \
  --group-hours 6 \
  --layout auto \
  --dry-run
```

| Flag | Required | Default | Notes |
|---|---|---|---|
| `--source` | yes | — | Folder of photos for this one hike |
| `--slug` | no | `hike-<date>` | Output folder name under `blog/trip-report/` |
| `--peak` | no | placeholder | `"Name:elevation"`; multiple: `"Peak1:3015,Peak2:3719"` |
| `--trail` | no | omitted | Free-text route, e.g. arrows between segments |
| `--town` | no | `Underhill` | |
| `--state` | no | `Vermont` | |
| `--group-hours` | no | `6` | Warns (doesn't split) if photos span more than this many hours |
| `--layout` | no | `auto` | `auto` \| `singles` \| `grid`/`pairs` — how images are wrapped |
| `--out` | no | `../striped-down/blog` | Override output root |
| `--dry-run` | no | off | Preview only |

`date`, `dateHiked`, and the fallback title all come from the earliest EXIF date in the source folder if you don't override them. `distance`, `totalTime`, and `temp` are always written as placeholders (`0.0 miles`, `0:00 hours`, `0F° on top`) — fill those in by hand after scaffolding.

---

## Concert

```bash
node scaffold-post.js concert \
  --source "concerts-raw/jeffrey-lewis" \
  --slug jeffrey-lewis/higher-ground-2024 \
  --venue "Higher Ground" \
  --artists "Jeffrey Lewis" \
  --festival "" \
  --event-date 2024-03-15 \
  --town "South Burlington" \
  --state Vermont \
  --layout auto \
  --dry-run
```

| Flag | Required | Default | Notes |
|---|---|---|---|
| `--source` | yes | — | Folder of photos for this show |
| `--slug` | yes | — | Output folder under `blog/concerts/`; nest as `artist/venue-year` for repeat acts |
| `--venue` | yes | — | |
| `--artists` | yes | — | Comma-separated; one name → plain string, 2+ → array (headliner first). Numeric names like `311` get auto-quoted in the YAML |
| `--festival` | no | omitted | Only written if given |
| `--event-date` | no | EXIF date | Falls back to the earliest photo's EXIF date if omitted |
| `--town` | no | `Unknown` | |
| `--state` | no | `Unknown` | |
| `--layout` | no | `auto` | Same options as hike mode |
| `--out` | no | `../striped-down/blog` | Override output root |
| `--dry-run` | no | off | Preview only |

`date` (publish date) is always today; `concerts.event-date` (actual show date, drives sort order) uses `--event-date` or falls back to EXIF.

---

## Image layout modes

- **`auto`** (default): every full group of 4 photos becomes a `<div class="grid cols-2 bleed">` block; leftover photos (<4) render as single `{% image %}` shortcodes.
- **`singles`**: every photo gets its own `{% image %}` line, no grid.
- **`grid`** / **`pairs`**: forces grid wrapping even on partial groups.

## After scaffolding

The script only ever produces placeholder body text and stub metadata — always open the generated `index.md` and fill in the real description, distance/time/temp (hikes), and any narrative before publishing.
