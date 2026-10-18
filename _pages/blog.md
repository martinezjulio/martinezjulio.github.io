---
layout: default
permalink: /blog/
title: blog
nav: true
nav_order: 4
---

<!-- pages/blog.md -->
<!-- One row per post: linked title on the left, date on the right, hairline
     divider between rows. All posts on one page, newest first (no pagination,
     descriptions, thumbnails, read times, featured cards or tag list). External
     `redirect:` posts open in a new tab with a small outbound-arrow icon. The
     heading is the site owner's name (page_heading.liquid), as on every page. -->
<div class="post">
  {% include page_heading.liquid %}

  <ul class="writing-list">
    {% for post in site.posts %}
      <li>
        <span class="writing-title">
          {% if post.redirect == blank %}
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          {% elsif post.redirect contains '://' %}
            <a href="{{ post.redirect }}" target="_blank">{{ post.title }}</a>
            <svg class="external-icon" viewBox="3 3 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
                fill-rule="evenodd"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
          {% else %}
            <a href="{{ post.redirect | relative_url }}">{{ post.title }}</a>
          {% endif %}
        </span>
        <span class="writing-date">{{ post.date | date: '%B %-d, %Y' }}</span>
      </li>
    {% endfor %}
  </ul>
</div>
