---
layout: blog.liquid
title: "{{ concerts.artist }} at {{ concerts.venue }}"
eleventyComputed:
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2025-11-13
concerts:
  event-date: 2016-10-14
  venue: Arts Riot
  artist: 
    - Whitney
    - Sam Evian
location: 
  town: Burlington
  state: Vermont
---

<div class="bleed">
{% image "img/IMG_9509.JPG", "Whitney at Arts Riot", "Max Kakacek" %}
</div>



There's something about having the drummer as a singer that changes the dyanamic of a show. The drums are pulled forward which equalizes the members. Julien Ehrlich's voice is hard to mimic. It's a bold falsetto I can't hold for more than half a song. I knew this going into it and was excited to see him maintain it live. 

Max is on guitar. He was a fun watch; his nerdy aesthetic rocking that strat. The riffs on this album, their first, are distortionless and just complicated enough for me to learn -- no, not in one sitting, but they feel possible. 

The stand out moment was the sparce brass. The horn section popped in and out of a few songs and made the crowd collectively wince in delight.

<figure>
  <video controls preload="metadata">
  <source src="{{ page.url | url }}vid/whitney.mp4" type="video/mp4">
    Your browser does not support HTML video.
  </video>

  <figcaption>Closing out _No Woman_</figcaption>
</figure>

{% image "img/IMG_9511.JPG", "Whitney at Arts Riot", "Whitney" %}

## Sam Evian

{% image "img/IMG_9504.JPG", "Openers, three others supporting Sam Evian", "Sam Evian" %}

<figure>
  <video controls preload="metadata">
  <source src="{{ page.url | url }}vid/sam-evian.mp4" type="video/mp4">
    Your browser does not support HTML video.
  </video>

  <figcaption>Sam Evian soloing</figcaption>
</figure>

{% image "img/merch-1.JPG", "Arts Riot art", "The merch table" %}
{% image "img/merch-2.JPG", "Arts Riot art", "Destroy Apathy! My favorite company motto ever." %}

{% image "img/whitney-poster.jpg", "Poster for Whitney at Arts Riot", "" %}
