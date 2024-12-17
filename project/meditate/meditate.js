document.addEventListener("DOMContentLoaded", () => {
  const trackList = document.getElementById("trackList");
  const audioPlayer = document.getElementById("audioPlayer");

  // Example tracks (replace with dynamic fetching from SoundCloud or other sources)
  const tracks = [
    { title: "Guided Meditation 1", url: "https://example.com/meditation1.mp3" },
    { title: "Guided Meditation 2", url: "https://example.com/meditation2.mp3" },
  ];

  // Render track list
  tracks.forEach((track, index) => {
    const listItem = document.createElement("li");
    listItem.className = "track-item";
    listItem.textContent = track.title;
    listItem.addEventListener("click", () => playTrack(track.url));
    trackList.appendChild(listItem);
  });

  // Play selected track
  function playTrack(url) {
    audioPlayer.src = url;
    audioPlayer.play();
  }
});
