---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2016-09-02
concerts:
  event-date: 2016-09-02
  venue: Arts Riot
  artist: Xenia Rubinos
location: 
  town: Burlington
  state: Vermont
---

{% image "img/IMG_9369.JPG", "Hiking photo from 2016-09-02", "Photo from the hike" %}

{% image "img/IMG_9370.JPG", "Hiking photo from 2016-09-02", "Photo from the hike" %}
