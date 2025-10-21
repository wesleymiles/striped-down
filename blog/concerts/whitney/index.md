---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2016-10-14
concerts:
  event-date: 2016-10-14
  venue: blank
  artist: Whitney
location: 
  town: Unknown
  state: Vermont
---

{% image "img/IMG_9504.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9506.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9507.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9508.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9509.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9510.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}

{% image "img/IMG_9511.JPG", "Hiking photo from 2016-10-14", "Photo from the hike" %}
