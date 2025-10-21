const slugify = require("slugify");

function makeSlug(str) {
  return slugify(str || "", {
	lower: true,
	strict: true,
	remove: /[*+~.()'"!:@]/g
  });
}

function unslugify(str) {
  if (!str) return "";
  return str
	.split("-")
	.map(w => w.charAt(0).toUpperCase() + w.slice(1))
	.join(" ");
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
	return [...set].sort();
  });

  // 🏛 Venues
  eleventyConfig.addCollection("venues", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const v = item.data.concerts?.venue;
	  if (v) set.add(v);
	});
	return [...set].sort();
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
	return [...set].sort();
  });

  // 🧭 States
  eleventyConfig.addCollection("states", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const s = item.data.location?.state;
	  if (s) set.add(s);
	});
	return [...set].sort();
  });

  // 🏘 Towns
  eleventyConfig.addCollection("towns", (collectionApi) => {
	const set = new Set();
	collectionApi.getAll().forEach(item => {
	  const t = item.data.location?.town;
	  if (t) set.add(t);
	});
	return [...set].sort();
  });

  // Filters
  eleventyConfig.addFilter("slugify", makeSlug);
  eleventyConfig.addFilter("unslugify", unslugify);

  // Artist-specific filters
  eleventyConfig.addFilter("primaryArtist", function(concerts) {
	if (!concerts?.artist) return "";
	const artist = Array.isArray(concerts.artist) ? concerts.artist[0] : concerts.artist;
	return unslugify(artist);
  });

  eleventyConfig.addFilter("otherArtists", function(concerts) {
	if (!concerts?.artist || !Array.isArray(concerts.artist)) return "";
	if (concerts.artist.length <= 1) return "";
	
	const others = concerts.artist.slice(1);
	return others.map(artist => unslugify(artist)).join(", ");
  });

  eleventyConfig.addFilter("allArtists", function(concerts) {
	if (!concerts?.artist) return "";
	const artists = Array.isArray(concerts.artist) ? concerts.artist : [concerts.artist];
	return artists.map(artist => unslugify(artist)).join(", ");
  });
};