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
    cache: false
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

    // taxonomy file here
  require("./src/taxonomy.js")(eleventyConfig);



  // ==================================================
  // IMAGE SHORTCODES
  // ==================================================
  function resolveImagePath(src, pageContext) {
    if (src.startsWith("./") || (!src.startsWith("/") && !src.startsWith("http"))) {
      const currentPageDir = pageContext.page?.inputPath
        ? path.dirname(pageContext.page.inputPath)
        : "";
      const cleanSrc = src.replace(/^\.\//, "");
      return currentPageDir ? path.join(currentPageDir, cleanSrc) : src;
    }
    return src;
  }

  eleventyConfig.addAsyncShortcode("image", async function (src, alt, caption = "", className = "") {
    const resolvedSrc = resolveImagePath(src, this);
    const processed = await processImage(resolvedSrc);
    const img = processed.full;
    const imageHtml = `<img src="${img.url}" width="${img.width}" height="${img.height}" alt="${alt || ''}" loading="lazy" decoding="async">`;
    return caption
      ? `<figure class="${className}">${imageHtml}<figcaption>${caption}</figcaption></figure>`
      : `<div class="${className}">${imageHtml}</div>`;
  });

  // ==================================================
  // COLLECTIONS
  // ==================================================
  eleventyConfig.addCollection("images", async function () {
    const imageDir = "art/img/";
    let files = fs.readdirSync(imageDir).filter(file => /\.(jpg|png|gif)$/i.test(file));

    let images = [];
    for (let file of files) {
      let imagePath = path.join(imageDir, file);
      const processed = await processImage(imagePath, {
        widths: [450, 750, null],
        formats: ["jpeg"],
        outputDir: "./_site/art/img/",
        urlPath: "/art/img/",
        fixOrientation: true
      });

      images.push({
        thumbUrl: processed.thumbnail.url,
        thumbWidth: processed.thumbnail.width,
        thumbHeight: processed.thumbnail.height,
        mediumUrl: processed.medium.url,
        mediumWidth: processed.medium.width,
        mediumHeight: processed.medium.height,
        fullUrl: processed.full.url,
        fullWidth: processed.full.width,
        fullHeight: processed.full.height,
        alt: file.replace(/\.\w+$/, "").replace(/[-_]/g, " "),
        date: getGitDate(imagePath),
        filename: file
      });
    }

    images.sort((a, b) => b.date - a.date);
    return images;
  });

  eleventyConfig.addCollection("artblogPosts", (collectionApi) =>
    collectionApi.getAll().filter(item => item.data.tags?.includes("art"))
  );

  eleventyConfig.addCollection("trip-report", (collectionApi) =>
    collectionApi.getFilteredByTag("trip-report")
  );


  // ==================================================
  // OTHER SETTINGS
  // ==================================================
  eleventyConfig.setTemplateFormats(["html", "liquid", "njk", "md"]);
  eleventyConfig.setLibrary("md", markdownIt({ html: true, typographer: true }));
  eleventyConfig.addGlobalData("siteUrl", "https://wescarr.com");

  // Passthrough
  const passthroughPaths = [
    "fonts", "feed.xsl", "font.woff", "font.ttf", "img", "css", "js", "vid/",
    "mp4", "webm", "animations", "js/script.js", "photoswipe/",
    "project/wobblies/img", "work/mockup-demo"
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
