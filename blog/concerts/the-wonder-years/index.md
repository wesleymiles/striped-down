---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-10-21
concerts:
  event-date: 2012-03-12
  venue: Paradise Rock Club
  artist:
    - The Wonder Years
    - Polar Bear Club
    - Transit
    - Into It. Over It.
location:
  town: Boston
  state: Massachusetts
---

Wonder Years
<div class="grid  bleed">
  {% image "img/wonder-years-1.jpg", "The Wonder Years at Paradise Rock Club", " " %}
</div>
{% image "img/wonder-years-2.jpg", "The Wonder Years at Paradise Rock Club", " " %}
{% image "img/wonder-years-3.jpg", "The Wonder Years at Paradise Rock Club", " " %}
{% image "img/wonder-years-4.jpg", "The Wonder Years at Paradise Rock Club", " " %}


Polar Bear Club

{% image "img/polar-bear-club-1.jpg", "Polar Bear Clubr at Paradise Rock Club", " " %}
{% image "img/polar-bear-club-2.jpg", "Polar Bear Clubr at Paradise Rock Club", " " %}


The Story So Far

{% image "img/the-story-so-far.jpg", "The Story So Far at Paradise Rock Club", " " %}

Transit

{% image "img/transit-1.jpg", "Transit at Paradise Rock Club", " " %}
{% image "img/transit-2.jpg", "Transit at Paradise Rock Club", " " %}
{% image "img/transit-3.jpg", "Transit at Paradise Rock Club", " " %}

