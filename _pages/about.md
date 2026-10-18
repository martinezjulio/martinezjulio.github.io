---
layout: about
title: about
nav_title: home # label used in the sidebar nav only; the page title stays `title`
permalink: /
subtitle: # TODO: affiliation / one-line tagline

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info:

selected_papers: false # includes a list of papers marked as "selected={true}"
social: false # includes social icons at the bottom of the page (disabled: the footer shows them site-wide)

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

Bio coming soon.

{% unless site.whats_new.enabled == false %}

<h2 class="whats-new-heading">
  <a href="{{ '/whats-new/' | relative_url }}">what's new</a>
</h2>

{% include whats_new.liquid limit='7' %}
{% endunless %}
