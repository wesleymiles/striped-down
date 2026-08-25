---
layout: blog.liquid
eleventyComputed:
  title: "{{ concerts | primaryArtist }} at {{ concerts.venue }}"
  description: "with {{ concerts | otherArtists }}"
tags: 
  - post
  - concert
date: 2026-08-25
concerts:
  event-date: 2013-02-18
  venue: Lupo's
  artist:
    - Jeff Mangum
    - Tall Firs
    - Briars of North America
location:
  town: Providence
  state: Rhode Island
---

{% image "img/IMG_3158.JPG", "A packed crowd at Lupo's in Providence, crystal chandelier above, everyone shoulder to shoulder waiting for Jeff Mangum", " " %}

This was the kind of show where everyone in the room knows every word. My closest memory to that level of committment is Dashboard Confessional. The singer fades to the background. He played all the Neutral Milk Hotel hits. More a group ceremony than a concert.


{% image "img/IMG_3159.JPG", "Appearing Tonight sign in a venue window showing Jeff Mangum with Tall Firs and Briars of North America at Lupo's Providence", " " %}
