---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags:
  - post
  - concert
date: 2026-09-01
concerts:
  event-date: 2006-06-01
  venue: City Hall Plaza
  artist:
    - Dashboard Confessional
    - As Fast As
location:
  town: Boston
  state: Massachusetts
---

Shot down to City Hall Plaza last minute for a free, rainy show. Highlight was a rendition of the Beatles' *We Can Work it Out* .

<!-- {% image "img/dashboardBOSTON_01.jpg", "Dashboard Confessional performing on an outdoor stage at City Hall Plaza in the rain, Boston City Hall in the background", " " %} -->
<div class="grid  bleed">

{% image "img/dashboardBOSTON_02.jpg", "Dashboard Confessional at City Hall Plaza", " " %}
</div>

{% image "img/dashboardBOSTON_03.jpg", "Dashboard Confessional on stage at City Hall Plaza", " " %}

{% image "img/dashboardSky1.JPG", "Rainy sky over City Hall Plaza during the Dashboard Confessional show", " " %}
