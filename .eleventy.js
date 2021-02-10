

module.exports = function(eleventyConfig) {

  // Output directory: _site
  // Copy `img/` to `_site/img`
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

};

let markdown = require("markdown-it")({
  html: true
});