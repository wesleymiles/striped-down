---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  # description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-10-20
concerts:
  event-date: 2026-08-30
  venue: Waterfront park
  artist: Thundercat
location:
  town: Burlington
  state: Vermont
---

What a venue. Right on lake champlain, watching music with your back to the sunset. One of these days I'll try a concert from a boat. 

Thundercat was a beast. Well, he was bashful inbetween songs, but jazzy, funky, and prog-rocky on that bass. For a three-piece, they filled the park. The last few songs turned toward his club hits as the sun was down

It was a family-friendly affair. My kids took quickly to his style: what with the wearing of picachu swag and singing songs with a choruses of "It's cool to be a cat (meow, meow, meow, meow)."



<figure>
  <video controls preload="metadata">
  <source src="{{ page.url | url }}vid/thundercat-jam.mp4" type="video/mp4">
    Your browser does not support HTML video.
  </video>

  <figcaption>Jazzy jams on the water</figcaption>
</figure>


{% image "img/thundercat-01.jpeg", "Thundercat at Waterfront park", " " %}
{% image "img/thundercat-03.jpeg", "Thundercat at Waterfront park", " " %}
{% image "img/thundercat-04.jpeg", "Thundercat at Waterfront park", " " %}
{% image "img/thundercat-06.jpeg", "Thundercat at Waterfront park", " " %}
{% image "img/thundercat-07.jpeg", "Thundercat at Waterfront park", " " %}
