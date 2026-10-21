---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  # description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-09-29
concerts:
  event-date: 2005-04-30
  venue: The Nightmare
  artist: Another Breath
location:
  town: Oneonta
  state: New York
---


The best picture I took at our off-campus apartment at SUNY oneonta, known as the nightmare.


<div class="grid bleed">
{% image "img/another-breath-at-the-nightmare.jpg", "Another Breath at an off campus apartment", " " %}
</div>
 