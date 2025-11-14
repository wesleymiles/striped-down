---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2024-10-26
concerts:
  event-date: 2024-10-26
  venue: Monkey House
  artist:
  - Chris Cohen
  - Paper Castles
location: 
  town: Burlington
  state: Vermont
---

{% image "img/IMG_4022.jpg", "Hiking photo from 2024-10-26", "Chris Cohen" %}

Touring the album 'Paint a Room.' The songs live somehow show their complexities. The jazziness of the timing and key changes are more prominent. This was an intimate one. The bar wasn't at its 96 person capacity and the songs being gentle and quiet really pulled you in.