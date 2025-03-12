const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Template formats
  eleventyConfig.setTemplateFormats("html,liquid,njk,md");

  // Readable dates
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {  
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Markdown config
  eleventyConfig.setLibrary("md", markdownIt({ html: true, breaks: false, typographer: true }));

  // Passthrough copy settings
  const passthroughPaths = [
    "fonts", "font.woff", "img", "css", "js", "animations", "js/script.js", "photoswipe/", "blog/snow-barn/img", "blog/ims/img", "blog/2024-review/img", "blog/commonplace-book/img",
    "blog/hack-day-2023/img", "blog/lunch-break-sacred-places/img", "blog/lunch-break-sacred-places/img/warwick",
    "blog/red-team-blues/img", "project/wobblies/img", "blog/chickens-v3/img",
    "blog/identifying-bark-in-winter/img", "blog/local-logos/img", "blog/non-fiction-comics/img",
    "work/mockup-demo"
  ];
  passthroughPaths.forEach(path => eleventyConfig.addPassthroughCopy({ [path]: path }));

  // Global data
  eleventyConfig.addGlobalData("siteUrl", "https://wescarr.com");

  // Image processing & collection (JPG ONLY)
  const imageDir = "art/img/";
  eleventyConfig.addCollection("images", async function () {
    let files = fs.readdirSync(imageDir).filter(file => /\.(jpg|png|gif)$/i.test(file));

    let images = [];
    for (let file of files) {
      let imagePath = path.join(imageDir, file);
      let options = {
        widths: [450, null], // Thumbnail + original
        formats: ["jpg"], // No WebP
        outputDir: "./_site/art/img/",
        urlPath: "/art/img/"
      };

      // Process image
      let metadata = await Image(imagePath, options);
      let imageInfo = metadata.jpeg[metadata.jpeg.length - 1];

      images.push({
        url: imageInfo.url,
        alt: file.replace(/\.\w+$/, "").replace(/[-_]/g, " "), // Auto alt text
        width: imageInfo.width,
        height: imageInfo.height
      });
    }

    return images;
  });

  // Register the image shortcode (JPG ONLY)
  eleventyConfig.addLiquidShortcode("image", (src, alt) => {
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  });
};
