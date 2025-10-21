---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2016-12-10
concerts:
  event-date: 2016-12-10
  venue: blank
  artist:
    - Andy Shauf
    - Chris Cohen
location: 
  town: Unknown
  state: Vermont
---

{% image "img/IMG_9674.JPG", "Hiking photo from 2016-12-10", "Photo from the hike" %}

{% image "img/IMG_9676.JPG", "Hiking photo from 2016-12-10", "Photo from the hike" %}

{% image "img/IMG_9678.JPG", "Hiking photo from 2016-12-10", "Photo from the hike" %}

{% image "img/IMG_9679.JPG", "Hiking photo from 2016-12-10", "Photo from the hike" %}

{% image "img/IMG_9680.JPG", "Hiking photo from 2016-12-10", "Photo from the hike" %}
