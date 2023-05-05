module.exports = function(eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");

  // maintaining image directories manually for now
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
    

    // Control which files Eleventy will process
    templateFormats: [
      "md", 
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

  }
  
};

