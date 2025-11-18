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

{% image "img/IMG_4875.jpeg", "Concert photo", "Bright Eyes" %}

{% image "img/IMG_4876.jpeg", "Concert photo", "Connor" %}


{% image "img/IMG_4873.jpeg", "Concert photo", "Cursive" %}

{% image "img/IMG_4874.jpeg", "Concert photo", "Cursive" %}



