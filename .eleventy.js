
module.exports = function(eleventyConfig) {


  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");  
  eleventyConfig.addPassthroughCopy("animations");

  //attempting to pass through image files and maintain the dir structure
  eleventyConfig.addPassthroughCopy("*/**.{jpg,png,webp,gif,svg,json}");


  eleventyConfig.addPassthroughCopy("js/script.js");

  // Maintain image directories manually for now 😡
  // eleventyConfig.addPassthroughCopy({ "project/wobblies/img": "project/wobblies/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/chickens-v1/img": "blog/chickens-v1/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/local-logos/img": "blog/local-logos/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/non-fiction-comics/img": "blog/non-fiction-comics/img" }); 
  // eleventyConfig.addPassthroughCopy({ "blog/andy-shauf-plays-norm/img": "blog/ andy-shauf-plays-norm/img" }); 
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


