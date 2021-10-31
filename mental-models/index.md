---
layout: page
title: Mental Models
---

A work in progress to capture the [mental models](https://fs.blog/mental-models/#what_are_mental_models) that shape my worldview.

> _[All models are wrong, but some are useful.](https://en.wikipedia.org/wiki/All_models_are_wrong)_

{% assign tags = site.categories.mental-models | map: "tag" | uniq %}
{% for tag in tags %}
  <h2>{{ tag | capitalize }}</h2>
  <ul>
    {% assign posts = site.tags[tag] | reverse %}
    {% for post in posts %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}