module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats(["html", "pdf", "liquid", "njk", "img", "mp4", "webm", "md", "js", "jpg", "svg", "png", "webp" ]);
};


module.exports = function(eleventyConfig) {

  // Output directory: _site
  // Copy `img/` to `_site/img`
  // Copy `mp4/` to `_site/mp4`
  eleventyConfig.addPassthroughCopy("pdf");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("mp4");
  eleventyConfig.addPassthroughCopy("webm");
  eleventyConfig.addPassthroughCopy("/posts");
  eleventyConfig.addPassthroughCopy("/drop");
  eleventyConfig.addPassthroughCopy("css");

};


//Creating pretty dates

const moment = require('moment');
moment.locale('en');

module.exports = function (eleventyConfig) {
 
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
 
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).format('LL'); // E.g. May 31, 2019
  });

  // registers the excerpt shortcode with eleventy
  eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

};


//Blog excerpts

function extractExcerpt(article) {
  if (!article.hasOwnProperty('templateContent')) {
    console.warn('Failed to extract excerpt: Document has no property "templateContent".');
    return null;
  }
 
  let excerpt = null;
  const content = article.templateContent;
 
  // The start and end separators to try and match to extract the excerpt
  const separatorsList = [
    { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
    { start: '<p>', end: '</p>' }
  ];
 
  separatorsList.some(separators => {
    const startPosition = content.indexOf(separators.start);
    const endPosition = content.lastIndexOf(separators.end);
 
    if (startPosition !== -1 && endPosition !== -1) {
      excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
      return true; // Exit out of array loop on first match
    }
  });
 
  return excerpt;
}