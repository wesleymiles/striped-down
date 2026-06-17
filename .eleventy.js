const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const htmlmin = require("html-minifier-terser");
const { execSync } = require("child_process");
const slugifyLib = require("slugify");

// ==================================================
// Utilities
// ==================================================
function getGitDate(filePath) {
  try {
    const timestamp = execSync(
      `git log -1 --format=%at -- "${filePath}"`,
      { encoding: "utf-8" }
    ).trim();
    return timestamp ? new Date(parseInt(timestamp) * 1000) : new Date();
  } catch (error) {
    console.warn(`Could not get git date for ${filePath}, using current date`);
    return new Date();
  }
}

async function processImage(src, options = {}) {
  const absPath = path.join(__dirname, src);
  if (!fs.existsSync(absPath)) {
    console.error(`Image not found: ${src} (looking for ${absPath})`);
    throw new Error(`Image not found: ${src}`);
  }

  const defaultOptions = {
    widths: [450, 750, null],
    formats: [path.extname(src).slice(1)],
    outputDir: path.join(__dirname, "_site", path.dirname(src)),
    urlPath: "/" + path.dirname(src),
    cache: true,
    fixOrientation: true
  };

  const finalOptions = { ...defaultOptions, ...options };
  const metadata = await Image(absPath, finalOptions);

  const formatKey = Object.keys(metadata)[0];
  const images = metadata[formatKey];

  return {
    thumbnail: images[0],
    medium: images[1] || images[0],
    full: images[images.length - 1],
    all: images,
    metadata
  };
}

function resolveImagePath(src, pageContext) {
  if (!src) {
    throw new Error("Image shortcode requires a src parameter");
  }
  if (src.startsWith("./") || (!src.startsWith("/") && !src.startsWith("http"))) {
    const currentPageDir = pageContext.page?.inputPath
      ? path.dirname(pageContext.page.inputPath)
      : "";
    const cleanSrc = src.replace(/^\.\//, "");
    return currentPageDir ? path.join(currentPageDir, cleanSrc) : src;
  }
  return src;
}

function extractFirstImageSrc(inputPath) {
  if (!inputPath || !fs.existsSync(inputPath)) return null;
  const content = fs.readFileSync(inputPath, "utf8");
  const body = content.replace(/^---[\s\S]*?---\s*/, "");
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("<!--")) continue;
    const match = line.match(/\{%\s*image\s+["']([^"']+)["']/);
    if (match) return match[1];
  }
  return null;
}

async function resolveOgImageUrl(data) {
  const siteUrl = data.siteUrl || "https://wescarr.com";

  if (data.ogImage) {
    return data.ogImage.startsWith("http")
      ? data.ogImage
      : `${siteUrl}${data.ogImage.startsWith("/") ? data.ogImage : `/${data.ogImage}`}`;
  }

  const inputPath = data.page?.inputPath;
  const firstSrc = extractFirstImageSrc(inputPath);
  if (firstSrc) {
    try {
      const resolvedSrc = resolveImagePath(firstSrc, { page: data.page });
      const processed = await processImage(resolvedSrc);
      return `${siteUrl}${processed.full.url}`;
    } catch (error) {
      console.warn(`OG image from first post image failed for ${inputPath}:`, error.message);
    }
  }

  const socialDir = path.join(__dirname, "img", "social");
  for (const name of ["default.jpg", "art.jpg"]) {
    if (fs.existsSync(path.join(socialDir, name))) {
      return `${siteUrl}/img/social/${name}`;
    }
  }
  return `${siteUrl}/img/apple-touch-icon.png`;
}

function slugifyString(str) {
  if (!str) return "";
  return slugifyLib(str, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

// ==================================================
// MAIN ELEVENTY CONFIG
// ==================================================
module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/art-feed.xml",
    collection: { name: "art", limit: 0 },
    metadata: {
      language: "en",
      title: "Art feed",
      subtitle: "This is a longer description about your blog.",
      base: "https://wescarr.com/blog/art",
      author: { name: "Wes Carr" }
    }
  });
  

  // ==================================================
  // GLOBAL PERMALINK SLUGIFY LOGIC
  // ==================================================
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => {
      const pathParts = data.page.filePathStem
        .split("/")
        .filter(Boolean)
        .filter(part => part !== "index")
        .map(part => slugifyString(part));

      return `/${pathParts.join("/")}/`;
    };
  });

  // ==================================================
  // FILTERS
  // ==================================================
  eleventyConfig.addFilter("slugify", slugifyString);
  eleventyConfig.addFilter("isArray", v => Array.isArray(v));
  eleventyConfig.addFilter("postDate", dateObj =>
    DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
  );
  eleventyConfig.addFilter("unslugify", slug =>
    slug
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
  eleventyConfig.addFilter("parseElevation", e =>
    e ? parseInt(e.toString().replace(/[^0-9]/g, "")) || 0 : 0
  );
  eleventyConfig.addFilter("formatElevation", e =>
    e ? e.toLocaleString() + " feet" : ""
  );
  eleventyConfig.addFilter("getHighestElevation", peaks => {
    if (!peaks || !Array.isArray(peaks) || peaks.length === 0) return 0;
    return peaks.reduce((max, p) => (p.elevation || 0) > max ? p.elevation : max, 0);
  });
  eleventyConfig.addFilter("totalElevation", peaks =>
    peaks?.reduce((sum, p) => sum + (p.elevation || 0), 0) || 0
  );
  
  // Strip HTML tags from text (for meta descriptions)
  eleventyConfig.addFilter("strip_html", str => {
    if (!str) return "";
    return str.toString().replace(/<[^>]*>/g, "");
  });

  // taxonomy file here
  require("./src/taxonomy.js")(eleventyConfig);

  // ==================================================
  // TAG COLLECTIONS FOR PAGINATION (handles tags with spaces)
  // ==================================================
  // Creates a collection of all tags with both original and slugified names
  // This allows tags with spaces like "Digital sovereignty" to work properly
  eleventyConfig.addCollection("allTags", function(collectionApi) {
    const tagMap = new Map();
    
    // Get all posts
    collectionApi.getAll().forEach(item => {
      const tags = item.data.tags;
      if (Array.isArray(tags)) {
        tags.forEach(tag => {
          if (tag && tag !== 'post' && tag !== 'homepage') {
            const slugified = slugifyString(tag);
            // Store original tag name, keyed by slugified version
            if (!tagMap.has(slugified)) {
              tagMap.set(slugified, tag);
            }
          }
        });
      }
    });
    
    // Return array of objects with both original and slugified names
    return Array.from(tagMap.entries()).map(([slug, original]) => ({
      slug: slug,
      original: original
    })).sort((a, b) => a.slug.localeCompare(b.slug));
  });

  // ==================================================
  // ART COLLECTION (for art blog posts)
  // ==================================================
  // Creates collections.art for posts tagged with "art"
  // This is used by the RSS feed plugin
  eleventyConfig.addCollection("workPreview", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("work-preview/projects/*.md")
      .sort(
        (a, b) =>
          (a.data.order ?? 999) - (b.data.order ?? 999) ||
          (a.data.title || "").localeCompare(b.data.title || "", undefined, {
            sensitivity: "base"
          })
      );
  });

  function workPreviewByPractice(collectionApi, practice) {
    return collectionApi
      .getFilteredByGlob("work-preview/projects/*.md")
      .filter((item) => item.data.practice === practice)
      .sort(
        (a, b) =>
          (a.data.order ?? 999) - (b.data.order ?? 999) ||
          (a.data.title || "").localeCompare(b.data.title || "", undefined, {
            sensitivity: "base"
          })
      );
  }

  eleventyConfig.addCollection("workPreviewRedHat", (api) =>
    workPreviewByPractice(api, "red-hat")
  );
  eleventyConfig.addCollection("workPreviewContractor", (api) =>
    workPreviewByPractice(api, "contractor")
  );
  eleventyConfig.addCollection("workPreviewLocal", (api) =>
    workPreviewByPractice(api, "local")
  );

  eleventyConfig.addCollection("art", function(collectionApi) {
    return collectionApi.getFilteredByTag("art")
      .filter(item => item.data.tags && item.data.tags.includes("post"))
      .sort((a, b) => b.date - a.date);
  });

  // ==================================================
  // IMAGES COLLECTION (for art gallery slideshow)
  // ==================================================
  eleventyConfig.addCollection("images", async (collectionApi) => {
    const artImgDir = path.join(__dirname, "art", "img");
    if (!fs.existsSync(artImgDir)) {
      return [];
    }

    const imageFiles = fs.readdirSync(artImgDir)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

    const images = [];
    for (const file of imageFiles) {
      const imagePath = path.join(artImgDir, file);
      const relativePath = `art/img/${file}`;
      
      try {
        const processed = await processImage(relativePath);
        
        // Use git date for consistent sorting across environments (Netlify vs local)
        const imageDate = getGitDate(imagePath);
        
        // Extract alt text from filename (remove extension, replace hyphens/underscores with spaces)
        const altText = file
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase());

        images.push({
          fullUrl: processed.full.url,
          fullWidth: processed.full.width,
          fullHeight: processed.full.height,
          thumbUrl: processed.thumbnail.url,
          thumbWidth: processed.thumbnail.width,
          thumbHeight: processed.thumbnail.height,
          mediumUrl: processed.medium.url,
          alt: altText,
          date: imageDate
        });
      } catch (error) {
        console.warn(`Failed to process image ${file}:`, error.message);
      }
    }

    // Sort by date (newest first)
    images.sort((a, b) => b.date.getTime() - a.date.getTime());

    return images;
  });

// ==================================================
// IMAGE SHORTCODES
// ==================================================
eleventyConfig.addAsyncShortcode("image", async function (src, alt, caption = "", link = "") {
  if (!src) {
    console.warn("Image shortcode called without src parameter");
    return "";
  }
  const resolvedSrc = resolveImagePath(src, this);
  const processed = await processImage(resolvedSrc);
  const img = processed.full;
  const imageHtml = `<img src="${img.url}" width="${img.width}" height="${img.height}" alt="${alt || ''}" loading="lazy" decoding="async">`;
  
  if (caption) {
    const captionHtml = link 
      ? `<a href="${link}">${caption}</a>` 
      : caption;
    return `<figure>${imageHtml}<figcaption>${captionHtml}</figcaption></figure>`;
  }
  
  return `<div>${imageHtml}</div>`;
});


  // ==================================================
  // OTHER SETTINGS
  // ==================================================
  eleventyConfig.setTemplateFormats(["html", "liquid", "njk", "md", "xml"]);
  eleventyConfig.setLibrary("md", markdownIt({ html: true, typographer: true }));
  eleventyConfig.addGlobalData("siteUrl", "https://wescarr.com");
  eleventyConfig.addGlobalData("eleventyComputed", {
    ogImageUrl: (data) => resolveOgImageUrl(data)
  });
  
  // Ignore README files (they're documentation, not content)
  eleventyConfig.ignores.add("**/README.md");

  // Passthrough
  // Browsers often fetch /favicon.ico before parsing <link rel="icon">
  eleventyConfig.addPassthroughCopy({ "img/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "img/apple-touch-icon.png": "apple-touch-icon.png" });

  const passthroughPaths = [
    "feed.xsl",
    "robots.txt",
    "fonts/BagnardSans.otf",
    "fonts/Bagnard.otf",
    "fonts/PublicSans-Light.ttf",
    "fonts/PublicSans-Medium.ttf",
    "fonts/PublicSans-Regular.ttf",
    "img",
    "css",
    "js",
    "vid/",
    "mp4",
    "webm",
    "animations",
    "js/script.js",
    "photoswipe/",
    "project/wobblies/img",
    "work/mockup-demo"
  ];

  const blogPath = "blog/";
  if (fs.existsSync(blogPath)) {
    const blogDirs = fs.readdirSync(blogPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(blogPath, dirent.name, "img"));
    passthroughPaths.push(...blogDirs);
  }

  passthroughPaths.forEach(p => eleventyConfig.addPassthroughCopy({ [p]: p }));

  // HTML minification
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return htmlmin.minify(content, { removeComments: true });
      }
      return content;
    });
  }
};
