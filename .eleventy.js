const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

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
    "fonts", "feed.xsl", "font.woff","font.ttf", "img", "css", "js", "animations", "js/script.js", "photoswipe/",
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



  // adding RSS
  eleventyConfig.addPlugin(feedPlugin, {
		type: "rss", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "post", // iterate over `collections.posts`
			limit: 0,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "Blog",
			subtitle: "This is a longer description about your blog.",
			base: "https://wescarr.com/",
			author: {
				name: "Wes Carr",
				//email: "",
			},
		},
    //stylesheet: "/feed.xsl", // stylesheet reference
	});




};




