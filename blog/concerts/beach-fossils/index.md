---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2025-11-16
concerts:
  event-date: 2025-11-16
  venue: Higher Ground
  artist:
    - Beach Fossils
    - Being Dead
location: 
  town: Burlington
  state: Vermont
---

