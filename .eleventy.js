const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const { DateTime } = require("luxon");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

async function getImageData(src, alt) {
  // Resolve absolute path to source file
  const absPath = path.join(__dirname, src);

  // Output into /_site/art/img/... or /_site/blog/post-1/img/... exactly
  const outputDir = path.join(__dirname, "_site", path.dirname(src));

  let metadata = await Image(absPath, {
    widths: [450, null],
    formats: [path.extname(src).slice(1)],
    outputDir: outputDir,
    urlPath: "/" + path.dirname(src),
    cache: false  // optional while editing
  });

  const formatKey = Object.keys(metadata)[0];
  const imageInfo = metadata[formatKey][metadata[formatKey].length - 1];

  return { imageInfo, alt: alt || "" };
}


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


    

  // -----------------
  // Gallery collection (sorted by file creation date, newest first)
  // -----------------
  const galleryDir = path.join(__dirname, "art/img/");
eleventyConfig.addCollection("images", async function () {
  const imageDir = "art/img/";
  let files = fs.readdirSync(imageDir).filter(file => /\.(jpg|png|gif)$/i.test(file));

  let images = [];
  for (let file of files) {
    let imagePath = path.join(imageDir, file);
    const stats = fs.statSync(imagePath);

    let options = {
      widths: [750, null], // First = thumbnail, last = original
      formats: ["jpg"], // No WebP
      outputDir: "./_site/art/img/",
      urlPath: "/art/img/"
    };

    let metadata = await Image(imagePath, options);

    let thumb = metadata.jpeg[0]; // smallest
    let full = metadata.jpeg[metadata.jpeg.length - 1]; // largest

      images.push({
        thumbUrl: metadata.jpeg[0].url,
        thumbWidth: metadata.jpeg[0].width,
        thumbHeight: metadata.jpeg[0].height,
        fullUrl: metadata.jpeg[metadata.jpeg.length - 1].url,
        fullWidth: metadata.jpeg[metadata.jpeg.length - 1].width,
        fullHeight: metadata.jpeg[metadata.jpeg.length - 1].height,
        alt: file.replace(/\.\w+$/, "").replace(/[-_]/g, " "),
        date: stats.birthtime
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



};




