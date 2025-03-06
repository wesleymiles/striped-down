// adding plugin to allow for active navigation
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

// fixing how 11ty skipped spaces and new lines in tabs
// eleventyConfig.setLibrary('md', null); // Disable Markdown rendering
const markdownIt = require("markdown-it");

// Lightbox
const fs = require("fs");

// Using eleventy-img Plugin 
const path = require('path');
const Image = require('@11ty/eleventy-img');


module.exports = function(eleventyConfig) {

  // adding plugin to allow for active navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // allowing for more langages -- liquid is the default, and what i'm using 
  eleventyConfig.setTemplateFormats("html,liquid,njk,md");

  // making dates more readable  
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {  
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });


  let options = {
    html: true,
    breaks: false,
    typographer: true,
    space:false,
    //htmlWhitespaceSensitivity:css,
  };
  eleventyConfig.setLibrary("md", markdownIt(options));


  // Passthrough copy settings
  const passthroughPaths = [
    "fonts",
    "font.woff",
    "img",
    "css",
    "js",
    "animations",
    "js/script.js",
    "photoswipe/",
    "art/img",
    "blog/snow-barn/img",
    "blog/ims/img",
    "blog/2024-review/img",
    "blog/commonplace-book/img",
    "blog/hack-day-2023/img",
    "blog/lunch-break-sacred-places/img",
    "blog/lunch-break-sacred-places/img/warwick",
    "blog/red-team-blues/img",
    "project/wobblies/img",
    "blog/chickens-v3/img",
    "blog/identifying-bark-in-winter/img",
    "blog/local-logos/img",
    "blog/non-fiction-comics/img",
    "work/mockup-demo"
  ];
  passthroughPaths.forEach(path => eleventyConfig.addPassthroughCopy({ [path]: path }));


  // Add site URL globally
  eleventyConfig.addGlobalData("siteUrl", "https://wescarr.com");

  // preparing images for lightbox

  eleventyConfig.addCollection("images", async function () {
    const imageDir = "art/img/"; // Path to image folder
    
    // Get list of image files in the directory
    let files = fs.readdirSync(imageDir)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
  
    // Process each image and fetch width/height
    let images = [];
    for (let file of files) {
      let imagePath = path.join(imageDir, file);
  
      // Get image metadata using eleventy-img
      let metadata = await Image(imagePath, {
        widths: [null], // Adjust for any specific width ranges you want
        formats: ["jpeg", "webp"], 
        outputDir: "./_site/art/img/",
        urlPath: "/art/img/"
      });
  
      // Get the last format (usually the best quality version)
      let imageInfo = metadata.jpeg[metadata.jpeg.length - 1]; // Use the appropriate format
  
      // Push image object with width, height, and URL
      images.push({
        url: imageInfo.url,
        alt: file.replace(/\.\w+$/, "").replace(/[-_]/g, " "), // Auto alt text
        width: imageInfo.width,
        height: imageInfo.height
      });
    }
  
    return images;
  });




};