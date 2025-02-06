---
templateEngine: ['vto']
layout: layouts/page.vto
title: Projects
url: /projects/
description: Documentation for ridiculous things
type: project-index
cssclasses: 
  - page
---

<ul class="projectList">
{{ for project of projects }}
  <li>
    <a href="{{ project.url }}">{{ project.title }}</a>
    <p>{{ project.description }}</p>
  </li>
{{ /for }}
</ul>