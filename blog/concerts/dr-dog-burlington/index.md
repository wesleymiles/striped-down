---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-09-29
concerts:
  event-date: 2015-01-21
  venue: Higherground
  artist:
    - Dr Dog
    - Yellerkin
location:
  town: Burlington
  state: Vermont
---

First time cathing the dog in my new hometown. 


<div class="grid bleed">
<!-- {% image "img/dr-dog-burlington-01.jpg", "Dr Dog at Higherground", " " %} -->
{% image "img/dr-dog-burlington-02.jpg", "Dr Dog at Higherground", " " %}
</div>


{% image "img/dr-dog-burlington-03.jpg", "Dr Dog at Higherground", " " %}
{% image "img/dr-dog-burlington-04.jpg", "Dr Dog at Higherground", " " %}

{% image "img/dr-dog-burlington-05.jpg", "Dr Dog at Higherground", " " %}

{% image "img/dr-dog-burlington-06.jpg", "Dr Dog at Higherground", " " %}
