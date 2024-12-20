// adding plugin to allow for active navigation
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

// fixing how 11ty skipped spaces and new lines in tabs
// eleventyConfig.setLibrary('md', null); // Disable Markdown rendering
const markdownIt = require("markdown-it");


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



  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");  
  eleventyConfig.addPassthroughCopy("animations");
  eleventyConfig.addPassthroughCopy("js/script.js");


  // attempting to pass through image files and maintain the dir structure
  // it's only working individually, not like this -->
  // eleventyConfig.addPassthroughCopy("**/*.{jpg,png,webp,gif,svg,json}"); 

  // eleventyConfig.addPassthroughCopy("**/*.jpg");
  // eleventyConfig.addPassthroughCopy("**/*.webp");
  // eleventyConfig.addPassthroughCopy("**/*.js");
  // eleventyConfig.addPassthroughCopy("**/*.svg");
  // eleventyConfig.addPassthroughCopy("**/*.gif");
  // eleventyConfig.addPassthroughCopy("**/*.png");


  // Maintain image directories manually for now 😡 
  eleventyConfig.addPassthroughCopy({ "blog/commonplace-book/img": "blog/commonplace-book/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/hack-day-2023/img": "blog/hack-day-2023/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/lunch-break-sacred-places/img": "blog/lunch-break-sacred-places/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/lunch-break-sacred-places/img/warwick": "blog/lunch-break-sacred-places/img/warwick" }); 
  eleventyConfig.addPassthroughCopy({ "blog/red-team-blues/img": "blog/red-team-blues/img" }); 
  eleventyConfig.addPassthroughCopy({ "project/wobblies/img": "project/wobblies/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/chickens-v3/img": "blog/chickens-v3/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/identifying-bark-in-winter/img": "blog/identifying-bark-in-winter/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/local-logos/img": "blog/local-logos/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/non-fiction-comics/img": "blog/non-fiction-comics/img" });
  eleventyConfig.addPassthroughCopy({ "work/mockup-demo": "work/mockup-demo" });   

  
};
