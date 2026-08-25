---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2026-08-25
concerts:
  event-date: 2009-08-26
  venue: PNC Bank Arts Center
  artist:
    - blink-182
    - Weezer
    - Taking Back Sunday
location:
  town: Holmdel
  state: New Jersey
---

Saw the weez by the beach in Jerzy.

{% image "img/weezer-4.JPG", "Weezer on stage", " " %}

<div class="grid cols-2 bleed">
{% image "img/weezer-3.JPG", "Weezer performing live", " " %}
{% image "img/weezer-1.JPG", "Weezer performing in front of a massive gold sequined backdrop with the band name on it, all members in white", " " %}
</div>


---

We were a little further back for blink. And captured no photos of TBS.

{% image "img/blink-182-1.JPG", "blink-182 performing on a massive amphitheater stage with three circular screens projecting Travis Barker drumming, pink stage lights and smoke", " " %}

<div class="grid cols-2 bleed">
{% image "img/blink-182-2.JPG", "blink-182 on stage", " " %}
{% image "img/blink-182-3.JPG", "blink-182 performing live", " " %}
</div>

<div class="grid cols-2 bleed">
{% image "img/blink-182-4.JPG", "blink-182 live", " " %}
{% image "img/blink-182-5.JPG", "blink-182 live", " " %}
</div>

{% image "img/blink-182-6.JPG", "blink-182 at PNC Bank Arts Center", " " %}
