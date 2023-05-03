module.exports = function(eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

  // maintaining image directories manually for now
  eleventyConfig.addPassthroughCopy({ "project/wobblies/img": "project/wobblies/img" }); 
  eleventyConfig.addPassthroughCopy({ "blog/andy-shauf-plays-norm/img": "blog/andy-shauf-plays-norm/img" }); 

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