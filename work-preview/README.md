# Work preview (temp)

Staging area for the future `/work/` section. **Does not replace** `/web` or `/logos` yet.

## URLs

| URL | Purpose |
|-----|---------|
| `/work-preview/` | Hub — intro + one link per practice area |
| `/work-preview/red-hat/` | Red Hat case studies |
| `/work-preview/home-services-agency/` | iMarket agency work + IMS blog visuals |
| `/work-preview/local-organizations/` | Local org case studies |
| `/work-preview/{slug}/` | Optional standalone page (logo-only projects) |

All pages use `noindex: true` until launch.

## Content model

Project files use `practice: red-hat | contractor | local`. Case studies use `permalink: false` and render on practice pages only.

## Styles

Uses `main.css` only (`body.Web`). Images stay in the content column—no `picture.full` or `stretch`.
