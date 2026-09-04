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
  event-date: 2012-04-07
  venue: Paradise Rock Club
  artist:
  - Nada Surf
  - An Horse
location:
  town: Boston
  state: Massachusetts
---

Nada Surf at the Paradise.

<div class="grid bleed">
{% image "img/nada-surf.jpg", "Nada Surf at the Paradise Rock Club", " " %}
</div>

<div class="grid cols-2 bleed">
{% image "img/nada-surf-2.jpg", "Nada Surf performing in Boston", " " %}
{% image "img/nada-surf-6.jpg", "Nada Surf at Paradise Rock Club", " " %}
{% image "img/nada-surf-4.jpg", "Nada Surf on stage", " " %}
</div>
