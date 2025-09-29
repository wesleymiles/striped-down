---
layout: blog.liquid
title: Tabs
description: Designing a better guitar tab experience
tags: postNOTYET
date: 2024-04-06
---




<section>

    {% for tab in collections.tabs %}
        <h2><a href="{{ tab.url }}">{{ tab.data.band }}</a></h2>
    {% endfor %}



{%- for tab in collections.tab -%}
  <li><a href="{{ tab.url }}">{{ tab.data.band }}: {{ tab.data.song }}</a></li>
{%- endfor -%}


</section>

