
module.exports = function(eleventyConfig) {

  // Copy the `img` and `css` folders to the output
  //eleventyConfig.addPassthroughCopy("img");
  //eleventyConfig.addPassthroughCopy("css");
  //eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("**/*.{jpg,jpeg,png,gif,js,img,svg}");


  // Maintain image directories manually for now
  eleventyConfig.addPassthroughCopy({ "project/wobblies/img": "project/wobblies/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/andy-shauf-plays-norm/img": "blog/andy-shauf-plays-norm/img" }); 
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


