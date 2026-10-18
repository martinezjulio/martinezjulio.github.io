---
layout: default
title: projects
permalink: /projects/
nav: true
nav_order: 3
---

<!-- pages/projects.md -->
<!-- Plain bulleted list of linked project titles, newest first (each project sets
     `date:` in its front matter; undated projects sink to the bottom). External
     `redirect:` links open in a new tab with the outbound-arrow SVG, mirroring
     _includes/whats_new.liquid. Projects still carry `category:`, `img:` and
     `description:` in front matter, but none of those are rendered here. Uses
     layout: default with the site-local heading (the owner's name, as on every
     page) instead of the gem's page layout, which would print the page title. -->
<div class="post">
  {% include page_heading.liquid %}

  <article>
    <ul class="projects-list">
      {% assign sorted_projects = site.projects | sort: "date", "first" | reverse %}
      {% for project in sorted_projects %}
        <li>
          {% if project.redirect == blank %}
            <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
          {% elsif project.redirect contains '://' %}
            <a href="{{ project.redirect }}" target="_blank">{{ project.title }}</a>
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
            <a href="{{ project.redirect | relative_url }}">{{ project.title }}</a>
          {% endif %}
        </li>
      {% endfor %}
    </ul>
  </article>
</div>
