---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2022-09-17
concerts:
  event-date: 2022-09-17
  venue: blank
  artist: They Might Be Giants
location: 
  town: Unknown
  state: Vermont
---

{% image "img/IMG_9732.JPG", "Hiking photo from 2022-09-17", "Photo from the hike" %}
