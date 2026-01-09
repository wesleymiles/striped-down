# Art Publishing Automation Setup

## Directory Structure

Your site now supports two ways to display art:

### 1. Art Slideshow (Existing - Unchanged)
- **Location**: `art/img/` 
- **Purpose**: Automatic gallery slideshow at `/art/`
- **How it works**: All images in `art/img/` are automatically collected into `collections.images` and displayed in a PhotoSwipe gallery
- **Status**: ✅ Keep using this as-is

### 2. Art Blog Posts (New)
- **Location**: `blog/art/post-name/index.md`
- **Purpose**: Individual art posts with descriptions, newsletter content, and social sharing
- **How it works**: Posts with `tags: ["post", "art"]` appear in `collections.art` and `collections.post`
- **Status**: ✅ Ready to use

## Integration with Your Site

### Collections
- **`collections.images`**: Still pulls from `art/img/` for the slideshow (unchanged)
- **`collections.art`**: New collection for art blog posts (posts with `tags: ["post", "art"]`)
- **`collections.post`**: Art posts automatically included (they have `tags: ["post", "art"]`)

### RSS Feed
- Your existing art RSS feed (`/art-feed.xml`) now uses `collections.art`
- It will include both old art posts (like `snow-barn`) and new ones from `blog/art/`

### URLs
- Art posts follow your existing permalink pattern: `/blog/art/post-name/`
- Slideshow remains at `/art/`

## Creating an Art Post

1. Create directory: `blog/art/my-artwork/`
2. Create `index.md` with front matter (see `blog/art/README.md` for template)
3. Add image to `blog/art/my-artwork/img/artwork.jpg`
4. Reference image in front matter: `image: img/artwork.jpg`
5. Set `blueskyPost: true` and/or `includeInNewsletter: true` if you want automation
6. Commit and push

## Automation Setup

### Step 1: Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and variables → Actions, add:
- `BLUESKY_USERNAME`: Your full Bluesky handle (e.g., `username.bsky.social`)
- `BLUESKY_PASSWORD`: Your Bluesky app password
- `BUTTONDOWN_API_KEY`: Your Buttondown API key

### Step 2: Update Site URL
Edit `.github/workflows/publish-art.yml` and update:
```yaml
SITE_URL: 'https://wescarr.com'  # Your actual site URL
```

### Step 3: Test
1. Create a test art post in `blog/art/test-post/`
2. Set `blueskyPost: false` and `includeInNewsletter: false` initially
3. Commit and push
4. Verify the post appears on your site
5. Then set the flags to `true` and push again to test automation

## Workflow

### Daily Art Publishing
1. Create art
2. Save image to `blog/art/post-name/img/artwork.jpg`
3. Create `blog/art/post-name/index.md` with details
4. Set `blueskyPost: true` and/or `includeInNewsletter: true`
5. `git add`, `git commit`, `git push`
6. Check Bluesky - post is live automatically!
7. Go to Buttondown, review draft, hit send when ready

### Quick Art (Slideshow Only)
- Just drop images in `art/img/` (existing workflow, unchanged)

## Files Created

- `.github/workflows/publish-art.yml` - GitHub Action workflow
- `.github/scripts/publish-art.js` - Publishing script
- `blog/art/README.md` - Detailed documentation
- `blog/art/example-post/index.md` - Example template (delete when ready)

## Notes

- Art posts use your existing `blog.liquid` layout
- They appear in your blog navigation and RSS feeds
- The slideshow at `/art/` continues to work independently
- Both systems can coexist - use slideshow for quick dumps, blog posts for featured pieces

