# Art Blog Posts

This directory contains art pieces as blog posts. These are separate from the art slideshow gallery (`/art/`), which automatically displays all images from `art/img/`.

## Structure

Each art post should be in its own directory:

```
blog/art/
  └── post-name/
      ├── index.md          # The blog post
      └── img/
          └── artwork.jpg   # The artwork image
```

## Front Matter Template

```yaml
---
layout: blog.liquid
title: "Artwork Title"
description: "Brief description for SEO and previews"
date: 2024-12-28
tags: 
  - post
  - art
image: img/artwork.jpg          # Relative to post directory (e.g., "img/artwork.jpg")
imageAlt: "Description of the artwork"

# Publishing options (both optional)
blueskyPost: true
includeInNewsletter: true
socialCaption: "Optional custom caption for Bluesky"
newsletterContent: |
  Write your newsletter content here.
  This will appear in the Buttondown email draft.
  You can use multiple paragraphs.
---

Your markdown content here. This will appear on the blog post page.

You can use the image shortcode for additional images:
```
{% image "img/artwork.jpg", "Alt text", "Caption" %}
```
```

## Publishing Workflow

1. Create your art post in `blog/art/post-name/index.md`
2. Add your image to `blog/art/post-name/img/artwork.jpg`
3. Set `blueskyPost: true` and/or `includeInNewsletter: true` in front matter
4. Commit and push to GitHub
5. The GitHub Action will automatically:
   - Post to Bluesky (if `blueskyPost: true`)
   - Create a draft in Buttondown (if `includeInNewsletter: true`)

## Notes

- The art slideshow at `/art/` continues to work independently
- Art posts appear in the `collections.post` collection (with `tags: art`)
- Art posts appear in the `collections.art` collection
- Images should be optimized before committing

