const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const htmlmin = require("html-minifier-terser");

// Unified image processing function for all use cases
async function processImage(src, options = {}) {
  // Resolve absolute path to source file
  const absPath = path.join(__dirname, src);
  
  // Check if file exists
  if (!fs.existsSync(absPath)) {
    console.error(`Image not found: ${src} (looking for ${absPath})`);
    throw new Error(`Image not found: ${src}`);
  }
  
  // Default options - can be overridden
  const defaultOptions = {
    widths: [450, 750, null], // thumbnail, medium, full size
    formats: [path.extname(src).slice(1)], // Keep original format
    outputDir: path.join(__dirname, "_site", path.dirname(src)),
    urlPath: "/" + path.dirname(src),
    cache: false
  };
  
  // Merge with custom options
  const finalOptions = { ...defaultOptions, ...options };
  
  let metadata = await Image(absPath, finalOptions);
  
  const formatKey = Object.keys(metadata)[0];
  const images = metadata[formatKey];
  
  return {
    thumbnail: images[0], // smallest
    medium: images[1] || images[0], // medium or fallback to smallest
    full: images[images.length - 1], // largest (original)
    all: images,
    metadata: metadata
  };
}

// Legacy function for backward compatibility
async function getImageData(src, alt) {
  const processed = await processImage(src);
  return { imageInfo: processed.full, alt: alt || "" };
}


module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Multiple image shortcodes for different use cases
  
  // Smart image shortcode with path resolution and optional caption
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, caption = "", className = "") {
    // Smart path resolution
    let resolvedSrc = src;
    
    // If src starts with './' or doesn't start with '/', make it relative to current page
    if (src.startsWith('./') || (!src.startsWith('/') && !src.startsWith('http'))) {
      // Get current page directory from the context
      const currentPageDir = this.page && this.page.inputPath 
        ? path.dirname(this.page.inputPath) 
        : '';
      
      // Remove leading './' if present
      const cleanSrc = src.replace(/^\.\//, '');
      resolvedSrc = currentPageDir ? path.join(currentPageDir, cleanSrc) : src;
      
      // Debug logging
      console.log(`Resolving image path:`);
      console.log(`  Original: ${src}`);
      console.log(`  Current page: ${this.page?.inputPath || 'unknown'}`);
      console.log(`  Current dir: ${currentPageDir}`);
      console.log(`  Resolved: ${resolvedSrc}`);
    }
    
    const processed = await processImage(resolvedSrc);
    const img = processed.full;
    
    const imageHtml = `<img src="${img.url}" 
                            width="${img.width}" 
                            height="${img.height}" 
                            alt="${alt || ''}" 
                            loading="lazy" 
                            decoding="async">`;
    
    if (caption) {
      return `<figure class="${className}">
        ${imageHtml}
        <figcaption>${caption}</figcaption>
      </figure>`;
    }
    
    return `<div class="${className}">${imageHtml}</div>`;
  });

  // Smart responsive image shortcode with path resolution and optional caption
  eleventyConfig.addAsyncShortcode("responsiveImage", async function(src, alt, caption = "", className = "") {
    // Smart path resolution
    let resolvedSrc = src;
    
    // If src starts with './' or doesn't start with '/', make it relative to current page
    if (src.startsWith('./') || (!src.startsWith('/') && !src.startsWith('http'))) {
      const currentPageDir = this.page && this.page.inputPath 
        ? path.dirname(this.page.inputPath) 
        : '';
      
      const cleanSrc = src.replace(/^\.\//, '');
      resolvedSrc = currentPageDir ? path.join(currentPageDir, cleanSrc) : src;
    }
    
    const processed = await processImage(resolvedSrc, {
      widths: [300, 600, 1200, null],
      formats: ["webp", "jpeg"]
    });
    
    const webp = processed.metadata.webp || [];
    const jpeg = processed.metadata.jpeg || [];
    
    let sourceTags = '';
    if (webp.length > 0) {
      const webpSrcset = webp.map(img => `${img.url} ${img.width}w`).join(', ');
      sourceTags += `<source type="image/webp" srcset="${webpSrcset}">`;
    }
    
    const jpegSrcset = jpeg.map(img => `${img.url} ${img.width}w`).join(', ');
    const fallback = jpeg[jpeg.length - 1];
    
    const pictureHtml = `<picture>
      ${sourceTags}
      <img src="${fallback.url}" 
           srcset="${jpegSrcset}"
           width="${fallback.width}" 
           height="${fallback.height}" 
           alt="${alt || ''}"
           loading="lazy" 
           decoding="async">
    </picture>`;
    
    if (caption) {
      return `<figure class="${className}">
        ${pictureHtml}
        <figcaption>${caption}</figcaption>
      </figure>`;
    }
    
    return `<div class="${className}">${pictureHtml}</div>`;
  });

  // Smart gallery/slideshow compatible shortcode with path resolution and optional caption
  eleventyConfig.addAsyncShortcode("galleryImage", async function(src, alt, caption = "", className = "") {
    // Smart path resolution
    let resolvedSrc = src;
    
    // If src starts with './' or doesn't start with '/', make it relative to current page
    if (src.startsWith('./') || (!src.startsWith('/') && !src.startsWith('http'))) {
      const currentPageDir = this.page && this.page.inputPath 
        ? path.dirname(this.page.inputPath) 
        : '';
      
      const cleanSrc = src.replace(/^\.\//, '');
      resolvedSrc = currentPageDir ? path.join(currentPageDir, cleanSrc) : src;
    }
    
    const processed = await processImage(resolvedSrc, {
      widths: [450, 750, null], // thumbnail, medium, full
      formats: ["jpeg"] // Keep single format for slideshow compatibility
    });
    
    const thumb = processed.thumbnail;
    const full = processed.full;
    
    const imageHtml = `<img src="${thumb.url}" 
                            data-full="${full.url}"
                            data-full-width="${full.width}"
                            data-full-height="${full.height}"
                            width="${thumb.width}" 
                            height="${thumb.height}" 
                            alt="${alt || ''}" 
                            class="gallery-image"
                            loading="lazy" 
                            decoding="async">`;
    
    if (caption) {
      return `<figure class="${className} gallery-figure">
        ${imageHtml}
        <figcaption>${caption}</figcaption>
      </figure>`;
    }
    
    return `<div class="${className}">${imageHtml}</div>`;
  });

  // Template formats
  eleventyConfig.setTemplateFormats("html,liquid,njk,md");

  // Readable dates
  eleventyConfig.addFilter("postDate", (dateObj) => {  
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Markdown config
  eleventyConfig.setLibrary("md", markdownIt({ html: true, breaks: false, typographer: true }));

  // Passthrough copy settings
  const passthroughPaths = [
    "fonts", "feed.xsl", "font.woff","font.ttf", "img", "css", "js", "vid/", "mp4", "webm", "animations", "js/script.js", "photoswipe/",
    "project/wobblies/img",
    "work/mockup-demo"
  ];

  // Dynamically find all blog image directories
  const blogPath = "blog/";
  if (fs.existsSync(blogPath)) { // Ensure the blog directory exists
    const blogDirs = fs.readdirSync(blogPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => path.join(blogPath, dirent.name, "img"));

    passthroughPaths.push(...blogDirs);
  }

  // Add passthrough copies
  passthroughPaths.forEach(path => eleventyConfig.addPassthroughCopy({ [path]: path }));

  // Global data
  eleventyConfig.addGlobalData("siteUrl", "https://wescarr.com");

  // Updated gallery collection using unified image processing
  eleventyConfig.addCollection("images", async function () {
    const imageDir = "art/img/";
    let files = fs.readdirSync(imageDir).filter(file => /\.(jpg|png|gif)$/i.test(file));

    let images = [];
    for (let file of files) {
      let imagePath = path.join(imageDir, file);
      const stats = fs.statSync(imagePath);

      // Use unified processing function
      const processed = await processImage(imagePath, {
        widths: [450, 750, null], // thumbnail, medium, full
        formats: ["jpeg"], // Keep single format for slideshow
        outputDir: "./_site/art/img/",
        urlPath: "/art/img/",
        fixOrientation: true, // because @11ty/eleventy-img doesn't always respect a photo's EXIF orientation metadata during processing
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
        date: stats.birthtime,
        filename: file
      });
    }

    // Sort by date, newest first
    images.sort((a, b) => b.date - a.date);
    return images;
  });

  // adding RSS
  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/art-feed.xml",
    collection: {
      name: "art", // iterate over `collections.posts`
      limit: 0,     // 0 means no limit
    },
    metadata: {
      language: "en",
      title: "Art feed",
      subtitle: "This is a longer description about your blog.",
      base: "https://wescarr.com/blog/art",
      author: {
        name: "Wes Carr",
        //email: "",
      },
    },
    //stylesheet: "/feed.xsl", // stylesheet reference
  });

  eleventyConfig.addCollection("artblogPosts", function(collectionApi) {
    // Filter all posts for those having the 'art' tag
    return collectionApi.getAll().filter(item => {
      return item.data.tags && item.data.tags.includes("art");
    });
  });


    // Only minify HTML in production
    if (process.env.NODE_ENV === "production") {
      eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if (outputPath && outputPath.endsWith(".html")) {
          let minified = htmlmin.minify(content, {
            // useShortDoctype: true,
            removeComments: true,
            // collapseWhitespace: true,
          });
          return minified;
        }
        return content;
      });
    }


};