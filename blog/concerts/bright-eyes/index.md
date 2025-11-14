---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2025-04-15
concerts:
  event-date: 2025-04-15
  venue: Higher Ground
  artist:
    - Bright Eyes
    - Cursive
location: 
  town: Burlington
  state: Vermont
---

{% image "img/IMG_4875.jpeg", "Hiking photo from 2025-04-15", "Bright Eyes" %}

{% image "img/IMG_4876.jpeg", "Hiking photo from 2025-04-15", "Connor" %}


{% image "img/IMG_4873.jpeg", "Hiking photo from 2025-04-15", "Cursive" %}

{% image "img/IMG_4874.jpeg", "Hiking photo from 2025-04-15", "Cursive" %}



