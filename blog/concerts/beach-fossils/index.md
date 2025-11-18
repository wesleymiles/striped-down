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
<div class="grid bleed">
{% image "img/beach-fossils.jpg", "Concert photo", "Beach Fossils" %}
</div>

{% image "img/beach-fossils-2.jpg", "Concert photo", "Beach Fossils" %}

{% image "img/beach-fossils-3.jpg", "Concert photo", "Beach Fossils" %}

{% image "img/beach-fossils-4.jpg", "Concert photo", "Beach Fossils" %}

{% image "img/beach-fossils-5.jpg", "Concert photo", "Beach Fossils" %}


{% image "img/being-dead.jpg", "Concert photo", "Being Dead" %}

{% image "img/being-dead-2.jpg", "Concert photo", "Being Dead" %}
