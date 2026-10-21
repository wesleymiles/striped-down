---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-09-30
concerts:
  event-date: 2006-03-26
  venue: "Cyclorama, Boston Center for the Arts"
  artist:
    - The Walkmen
    - UNBUSTED
location:
  town: Boston
  state: Massachusetts
---

Small show at a college building. Way under-attended.

{% image "img/the-walkmen-01.jpg", "The Walkmen at Cyclorama, Boston Center for the Arts", " " %}
