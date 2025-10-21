---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2016-05-07
concerts:
  event-date: 2016-05-07
  venue: blank
  artist:
    - Waking Windows
    - Protomartr
    - Chris Cohen
    - Waxahachee
    - Yacht
location: 
  town: Winooski
  state: Vermont
---

{% image "img/IMG_8990.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}

{% image "img/IMG_8991.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}

{% image "img/IMG_8992.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}

{% image "img/IMG_8994.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}

{% image "img/IMG_8995.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}

{% image "img/IMG_8996.JPG", "Hiking photo from 2016-05-07", "Photo from the hike" %}
