---
layout: post
title: XSS on a Document Converter
---

When I was switching my blog to Jekyll, I needed to convert a few long Word docs to Markdown; one of which being the [Web Application Cheat Sheet]({% link resources/web-application-cheat-sheet/index.md %}). Being about web security, the document contained many XSS payloads and other nastiness. It also had a lot of nested bullet points, which would have made conversion by hand a pain. So, I found a promising conversion app called [word-to-markdown](https://word-to-markdown.herokuapp.com/), dropped in the Word doc, and lo and behold..

[![Reflected XSS alert]({% link /resources/xss/xss.png %})]({% link /resources/xss/xss.png %})

Great, should have seen this coming.

It turned out the site was treating the document's contents as HTML, and thus rendering the content on the right side of the page without HTML-encoding it. This opened up a Reflected XSS vulnerability -- albeit not very practical, but still bad nonetheless. Thankfully, the source code was available on [GitHub](https://github.com/benbalter/word-to-markdown-demo) and the developer was very receptive to contributions. I made some quick changes, and after a simple fork and pull request the updated version went live.

The fix was pretty simple -- since most people wouldn't write HTML in a Word doc and expect it to be rendered as such, I HTML-encoded the Markdown after conversion so the document's contents would show up as regular text and not HTML. Here's how XSS payloads are rendered now:

[![HTML-encoded XSS payload]({% link /resources/xss/after.png %})]({% link /resources/xss/after.png %})
