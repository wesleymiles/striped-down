module.exports = function(eleventyConfig) {

  // making dates more readable
  
  const { DateTime } = require("luxon");
  eleventyConfig.addFilter("postDate", (dateObj) => {  
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });


  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");  
  eleventyConfig.addPassthroughCopy("animations");


  //attempting to pass through image files and maintain the dir structure
  //it's only working individually, not like this -->
  eleventyConfig.addPassthroughCopy("**/*.{jpg,png,webp,gif,svg,json}"); 

  eleventyConfig.addPassthroughCopy("js/script.js");
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.addPassthroughCopy("**/*.webp");
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/*.svg");
  eleventyConfig.addPassthroughCopy("**/*.gif");
  eleventyConfig.addPassthroughCopy("**/*.png");


  // Maintain image directories manually for now 😡 
  // eleventyConfig.addPassthroughCopy({ "project/wobblies/img": "project/wobblies/img" }); 

  eleventyConfig.addPassthroughCopy({ "blog/chickens-v1/img": "blog/chickens-v1/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/local-logos/img": "blog/local-logos/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/non-fiction-comics/img": "blog/non-fiction-comics/img" });
  eleventyConfig.addPassthroughCopy({ "work/mockup-demo": "work/mockup-demo" });   


  // Set the output directory for the example directory
  eleventyConfig.addPassthroughCopy("work/mockup-demo");


  // Tell 11ty not to create separate folders for files in the work/mockup-demo directory
  eleventyConfig.setBrowserSyncConfig({
    server: {
      baseDir: "./_site",
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    serveStatic: [{
      route: '/work/mockup-demo',
      dir: 'work/mockup-demo',
    }]
  });

  return {

  }
  
};

