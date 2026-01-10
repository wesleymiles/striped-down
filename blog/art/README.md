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

### Automatic Publishing (Recommended)

1. Create your art post in `blog/art/post-name/index.md`
2. Add your image to `blog/art/post-name/img/artwork.jpg`
3. Set `blueskyPost: true` and/or `includeInNewsletter: true` in front matter
4. Commit and push to GitHub
5. The GitHub Action will automatically:
   - Post to Bluesky (if `blueskyPost: true`)
   - Create a draft in Buttondown (if `includeInNewsletter: true`)

### Smart Change Detection

The workflow only publishes when publishing flags change, not when you make content edits:
- ✅ **Will publish**: Changing `includeInNewsletter: false` → `true`
- ✅ **Will publish**: Changing `blueskyPost: false` → `true`
- ❌ **Won't publish**: Fixing a typo in the content
- ❌ **Won't publish**: Updating the description or newsletter content

### Manual Trigger (For Testing/Re-publishing)

To manually trigger the workflow or force re-publish all posts:

1. Go to your GitHub repo → **Actions** tab
2. Select **"Publish New Art"** workflow
3. Click **"Run workflow"**
4. Optionally check **"Force re-publish even if flags unchanged"** to process all posts
5. Click **"Run workflow"**

This is useful for:
- Testing the workflow
- Re-publishing to a larger audience
- Processing posts that were skipped due to errors

## Notes

- The art slideshow at `/art/` continues to work independently
- Art posts appear in the `collections.post` collection (with `tags: art`)
- Art posts appear in the `collections.art` collection
- Images should be optimized before committing

