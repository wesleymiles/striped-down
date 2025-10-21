---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2024-10-26
concerts:
  event-date: 2024-10-26
  venue: blank
  artist: Chris Cohen
location: 
  town: Unknown
  state: Vermont
---

{% image "img/IMG_4022.jpeg", "Hiking photo from 2024-10-26", "Photo from the hike" %}
