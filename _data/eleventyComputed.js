const unslugify = (str) =>
  str
	? str
		.toString()
		.split("-")
		.map(w => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ")
	: "";

module.exports = {
  title: (data) => {
	const artist = data.concerts?.artist;
	const venue = data.concerts?.venue;

	let artistName = "";
	if (Array.isArray(artist)) artistName = artist[0];
	else if (typeof artist === "string") artistName = artist;

	// Check if front matter has a "title" placeholder
	if (data.title && artistName && venue) {
	  return data.title
		.replace("{{ concerts.artist }}", unslugify(artistName))
		.replace("{{ concerts.venue }}", venue);
	}

	// If no placeholder, just build it dynamically
	if (artistName && venue) {
	  return `${unslugify(artistName)} played at ${venue}`;
	}

	return data.title;
  }
};
