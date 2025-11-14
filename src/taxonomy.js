// Note: slugify and unslugify filters are defined in .eleventy.js
// We use them here but don't redefine them to avoid duplicates

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

  // ==================================================
  // TAXONOMY-SPECIFIC FILTERS
  // ==================================================
  
  // Helper function to unslugify (matches .eleventy.js implementation)
  function unslugify(str) {
	if (!str) return "";
	return str
	  .split("-")
	  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
	  .join(" ");
  }

  // 🎤 Artist/Concert filters
  // Get the display name (festival or first artist)
  eleventyConfig.addFilter("primaryArtist", function(concerts) {
	if (!concerts) return "";
	
	// If it's a festival, return the festival name
	if (concerts.festival) {
	  return concerts.festival;
	}
	
	// Otherwise return the first artist (unslugified)
	if (Array.isArray(concerts.artist)) {
	  return unslugify(concerts.artist[0]);
	}
	
	return unslugify(concerts.artist || "");
  });

  // Get other artists (excluding the primary one, or all if festival)
  eleventyConfig.addFilter("otherArtists", function(concerts) {
	if (!concerts || !concerts.artist) return "";
	
	const artists = Array.isArray(concerts.artist) ? concerts.artist : [concerts.artist];
	
	// If it's a festival, show all artists
	if (concerts.festival) {
	  return artists.map(artist => unslugify(artist)).join(", ");
	}
	
	// Otherwise skip the first artist (it's the primary)
	const others = artists.slice(1);
	return others.length > 0 ? others.map(artist => unslugify(artist)).join(", ") : "";
  });

  // Get all artists as a formatted string
  eleventyConfig.addFilter("allArtists", function(concerts) {
	if (!concerts?.artist) return "";
	const artists = Array.isArray(concerts.artist) ? concerts.artist : [concerts.artist];
	return artists.map(artist => unslugify(artist)).join(", ");
  });

  // Check if it's a festival
  eleventyConfig.addFilter("isFestival", function(concerts) {
	return concerts && concerts.festival ? true : false;
  });
};