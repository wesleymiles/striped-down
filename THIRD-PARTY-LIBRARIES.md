# Third-Party Libraries

This document lists all third-party libraries and dependencies used in this project.

> **Related:** See [Site Architecture](SITE-ARCHITECTURE.md) for diagrams showing how the build process works, and [Taxonomy Map](TAXONOMY-MAP.md) for content organization.

## NPM Dependencies

### Core Framework & Build Tools

#### [@11ty/eleventy](https://www.11ty.dev/) `^3.0.0`
- **Type:** Dev Dependency
- **Purpose:** Static site generator (SSG) - the core framework
- **Usage:** Build system and templating engine
- **License:** MIT

#### [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) `^6.0.4`
- **Type:** Dev Dependency
- **Purpose:** Image optimization and processing plugin for Eleventy
- **Usage:** Image resizing, format conversion, and optimization
- **License:** MIT

#### [@11ty/eleventy-navigation](https://www.11ty.dev/docs/plugins/navigation/) `^0.3.5`
- **Type:** Dev Dependency
- **Purpose:** Hierarchical navigation plugin for Eleventy
- **Usage:** Generates navigation structure from front matter
- **License:** MIT

#### [@11ty/eleventy-plugin-rss](https://www.11ty.dev/docs/plugins/rss/) `^2.0.4`
- **Type:** Dependency
- **Purpose:** RSS feed generation plugin
- **Usage:** Generates RSS/Atom feeds from collections
- **License:** MIT

#### [@11ty/eleventy-upgrade-help](https://www.11ty.dev/docs/plugins/upgrade-help/) `^1.0.1`
- **Type:** Dependency
- **Purpose:** Upgrade helper for Eleventy migrations
- **Usage:** Development tool for version upgrades
- **License:** MIT

### Template & Content Processing

#### [liquidjs](https://liquidjs.com/) `^10.7.1`
- **Type:** Dependency
- **Purpose:** Liquid templating engine
- **Usage:** Template rendering (used by Eleventy)
- **License:** MIT

#### [markdown-it](https://github.com/markdown-it/markdown-it) `^13.0.1`
- **Type:** Dependency
- **Purpose:** Markdown parser
- **Usage:** Converts Markdown to HTML
- **License:** MIT

### Image Processing

#### [sharp](https://sharp.pixelplumbing.com/) `^0.32.1`
- **Type:** Dependency
- **Purpose:** High-performance image processing library
- **Usage:** Image manipulation and optimization (used by eleventy-img)
- **License:** Apache-2.0

#### [exiftool-vendored](https://github.com/mceachen/exiftool-vendored) `^31.1.0`
- **Type:** Dependency
- **Purpose:** EXIF metadata extraction from images
- **Usage:** Reading and writing image metadata
- **License:** Image-ExifTool (Artistic License 1.0)

### Utilities

#### [luxon](https://moment.github.io/luxon/) `^3.4.4`
- **Type:** Dependency
- **Purpose:** Modern date and time library
- **Usage:** Date formatting and manipulation
- **License:** MIT

#### [debug](https://github.com/debug-js/debug) `^4.3.2`
- **Type:** Dependency
- **Purpose:** Debug logging utility
- **Usage:** Conditional debug logging
- **License:** MIT

#### [fast-glob](https://github.com/mrmlnc/fast-glob) `^3.3.3`
- **Type:** Dependency
- **Purpose:** Fast file system glob matching
- **Usage:** File pattern matching
- **License:** MIT

#### [fs-extra](https://github.com/jprichardson/node-fs-extra) `^11.3.2`
- **Type:** Dependency
- **Purpose:** Extended file system utilities
- **Usage:** Enhanced file operations
- **License:** MIT

#### [punycode](https://github.com/bestiejs/punycode.js) `^2.3.1`
- **Type:** Dependency
- **Purpose:** Unicode domain name encoding
- **Usage:** URL encoding/decoding
- **License:** MIT

### Frontend Libraries

#### [photoswipe](https://photoswipe.com/) `^5.4.4`
- **Type:** Dependency (local copy in `/photoswipe/`)
- **Purpose:** JavaScript image gallery and lightbox
- **Usage:** Image gallery on `/art/` and homepage
- **Location:** Loaded from local `/photoswipe/dist/` directory
- **License:** MIT
- **Note:** This is a local copy of the library, not loaded via CDN

### Build Tools

#### [html-minifier-terser](https://github.com/terser/html-minifier-terser) `^7.2.0`
- **Type:** Dev Dependency
- **Purpose:** HTML minification
- **Usage:** Minifies HTML output during build
- **License:** MIT

---

## CDN-Loaded Libraries

These libraries are loaded via CDN and are not installed via npm.

### Animation

#### [Lottie (bodymovin)](https://airbnb.io/lottie/) `5.12.2`
- **CDN:** `cdnjs.cloudflare.com`
- **URL:** `https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js`
- **Purpose:** Animation library for After Effects animations
- **Usage:** Used on `/one-week-logo/` page
- **License:** MIT
- **Loaded Conditionally:** Only on `/one-week-logo/` page

### Data Visualization

#### [Chart.js](https://www.chartjs.org/) `4.4.0`
- **CDN:** `cdn.jsdelivr.net`
- **URL:** `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
- **Purpose:** Chart and graph library
- **Usage:** Trip report charts on `/blog/tag/trip-report/` page
- **License:** MIT
- **Loaded Conditionally:** Only on `/blog/tag/trip-report/` page

#### [chartjs-adapter-date-fns](https://github.com/chartjs/chartjs-adapter-date-fns) `3.0.0`
- **CDN:** `cdn.jsdelivr.net`
- **URL:** `https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3.0.0/dist/chartjs-adapter-date-fns.bundle.min.js`
- **Purpose:** Date adapter for Chart.js using date-fns
- **Usage:** Enables date/time axis support in Chart.js
- **License:** MIT
- **Loaded Conditionally:** Only on `/blog/tag/trip-report/` page (with Chart.js)

---

## Library Usage Summary

### By Page/Feature

| Library | Used On | Type |
|---------|---------|------|
| PhotoSwipe | `/art/`, `/` (homepage) | Local (npm) |
| Lottie | `/one-week-logo/` | CDN |
| Chart.js | `/blog/tag/trip-report/` | CDN |
| chartjs-adapter-date-fns | `/blog/tag/trip-report/` | CDN |

### By Installation Method

- **NPM Packages:** 18 dependencies + 4 dev dependencies
- **CDN Libraries:** 3 libraries (loaded conditionally)
- **Local Copy:** PhotoSwipe (installed via npm but served locally)

---

## Notes

- **Conditional Loading:** CDN libraries are loaded conditionally based on page URL to optimize performance
- **PhotoSwipe:** While installed via npm, PhotoSwipe is served from a local `/photoswipe/` directory rather than from node_modules
- **No Font CDNs:** All fonts are self-hosted in `/fonts/` directory (Google Fonts links are commented out)
- **Archive.org Scripts:** The `bark-moon.html` page includes Archive.org scripts, but these are part of an archived page snapshot, not active dependencies

---

## License Summary

All listed libraries use permissive licenses (primarily MIT, with one Apache-2.0 and one Artistic License 1.0), making them suitable for use in open-source and commercial projects.

