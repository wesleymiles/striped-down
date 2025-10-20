const slugify = require("slugify");

function makeSlug(str) {
  return slugify(str || "", {
	lower: true,
	strict: true,
	remove: /[*+~.()'"!:@]/g
  });
}

module.exports = function (eleventyConfig) {
  // 🧠 Artists
  eleventyConfig.addCollection("artists", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const val = item.data.concerts?.artist;
	  if (Array.isArray(val)) val.forEach(a => set.add(a));
	  else if (val) set.add(val);
	});
	const result = [...set].sort();
	console.log("🎯 Artists:", result);
	return result;
  });

  // 🏛 Venues
  eleventyConfig.addCollection("venues", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const v = item.data.concerts?.venue;
	  if (v) set.add(v);
	});
	const result = [...set].sort();
	console.log("🎯 Venues:", result);
	return result;
  });

  // 🏔 Peaks
  eleventyConfig.addCollection("peaks", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const peaks = item.data.trips?.peaks;
	  if (Array.isArray(peaks)) {
		peaks.forEach(peak => {
		  if (peak.name) set.add(peak.name);
		});
	  }
	});
	const result = [...set].sort();
	console.log("🎯 Peaks:", result);
	return result;
  });

  // 🧭 States
  eleventyConfig.addCollection("states", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const s = item.data.location?.state;
	  if (s) set.add(s);
	});
	const result = [...set].sort();
	console.log("🎯 States:", result);
	return result;
  });

  // 🏘 Towns
  eleventyConfig.addCollection("towns", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const t = item.data.location?.town;
	  if (t) set.add(t);
	});
	const result = [...set].sort();
	console.log("🎯 Towns:", result);
	return result;
  });

  // Helper filter
  eleventyConfig.addFilter("slugify", makeSlug);
};

