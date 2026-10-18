---
layout: default
permalink: /publications/
title: publications
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<!-- Uses layout: default with the site-local heading (the owner's name, as on
     every page) instead of the gem's page layout, which would print the page
     title. The bibliography markup is unchanged. -->
<div class="post">
  {% include page_heading.liquid %}

  <article>
    <!-- Bibsearch Feature -->
    <!-- {% include bib_search.liquid %} -->
    <div class="publications">
      {% bibliography %}
    </div>
  </article>
</div>
