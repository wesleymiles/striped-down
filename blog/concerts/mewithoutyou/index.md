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
  event-date: 2007-03-14
  venue: "Middle East, downstairs "
  artist:
    - mewithoutyou
    - Sparta
    - Aloha
location:
  town: Cambridge
  state: Massachusetts
---

<div class="grid bleed">
{% image "img/mewithoutyou-02.jpg", "mewithoutYou at Middle East, downstairs ", " " %}
</div>
{% image "img/mewithoutyou-01.jpg", "mewithoutYou at Middle East, downstairs ", " " %}
{% image "img/mewithoutyou-03.jpg", "mewithoutYou at Middle East, downstairs ", " " %}
<!-- {% image "img/mewithoutyou-04.jpg", "mewithoutYou at Middle East, downstairs ", " " %} -->
