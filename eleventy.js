module.exports = function(eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

  // eleventyConfig.setTemplateFormats(["html", "pdf", "nks", "liquid", "njk", "img", "mp4", "webm", "md", "js", "jpg", "svg", "png", "webp" ]);


  // eleventyConfig.addPassthroughCopy("posts");
  // eleventyConfig.addPassthroughCopy("work");
  // eleventyConfig.addPassthroughCopy("work/mockup");
  // eleventyConfig.addPassthroughCopy("play");
  // eleventyConfig.addPassthroughCopy({ "**/*.pdf": "play" });


  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
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


};