---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-09-01
concerts:
  event-date: 2004-04-30
  venue: SUNY Binghamton
  artist: 
    - Brand New
    - Nightmare of You
location:
  town: Binghamton 
  state: New York
---

Blurry photos and memory of Brand New on the *Deja Entendu* tour. 

{% image "img/bing1.JPG", "Brand New performing in a dark club with motion-blurred stage lights", " " %}

{% image "img/bing4.JPG", "Brand New guitarist in a striped shirt on stage", " " %}

{% image "img/bing6.JPG", "Brand New live, crowd silhouettes in the foreground", " " %}
