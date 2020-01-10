---
layout: "post"
title: "From Jekyll and GitBook to Hugo and Asciidoc, care of Github Actions"
date: "2020-01-08 21:15"
tags:
  - jekyll
  - hugo
  - blog
---
This won't be a super chatty post. We have two websites for Game On! (our microservices text adventure): a jekyll-based markdown blog and a legacy-gitbook-based asciidoc book. For various reason, I want to combine them,and I woukd rather not spend gobs of time converting between markdown and asciidoc.

To keep things quick: I knew I wanted a static site generator, and I've used hugo before and found it fast, straight-forward and unconfusing. So in my mind, I'd already picked hugo.

I found these two posts on hugo with asciidoc:

* [Better Hugo/AsciiDoc HTML](http://ratfactor.com/hugo-adoc-html5s/)
* [Get Hugo to render (nice) Asciidocs](https://blog.anoff.io/2019-02-17-hugo-render-asciidoc/)

The second references the first. The first is also referenced in a git issue about some issues with how hugo invokes external helpers like asciidoc. The bottom line is that I can use hugo to do what I want, but there are some tricks required to influence how asciidoc is invoked to get better output.

## Thinking about deployment

The existing two sites use Travis. They've existed so long (and have been running so well) that I forgot how to set them up. And, in the interim, the travis-ci.org vs. travis-ci.com shift has happened, and for one of the repos in particular, it feels like the settings have disappeared entirely. So. I can either figure out what happened with Travis and set that up again, or go fiddle with the new shiny thing, GitHub Actions.

The new shiny toy won because of these two actions:

* [peaceiris/actions-hugo](https://github.com/peaceiris/actions-hugo)
* [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

These two actions (found easily in the marketplace) are well-documented and do exactly what I want. I will likely fork/clone/copy them over time, but it was nice to just see them already there.

At this point, I'm nowhere near ready for deployment, so I haven't done much with the second. I used the first to start putting together a workflow that builds a new hugo-based site, with baby steps: First set-up hugo, then set up asciidoc with the tweaks noted above.

So far, this experiment looks like this:

```yaml
name: publish

on:
  push:
    branches:
    - hugo

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: check out
      uses: actions/checkout@v1

    - name: Setup ruby
      uses: actions/setup-ruby@v1
      with:
        ruby-version: '2.x'

    - name: Setup Asciidoctor
      run: |
        gem install asciidoctor
        gem install asciidoctor-html5s
        gem install asciidoctor-diagram
        . ./wrap_asciidoc.sh
        asciidoctor --version

    - name: Setup Hugo
      uses: peaceiris/actions-hugo@v2
      with:
        hugo-version: '0.62.2'

    - name: Build
      run: |
        export PATH=$PWD/bin:$PATH
        which asciidoctor
        hugo --minify
```

I defined one custom script (`wrap_asciidoc.sh`) used in the 'Setup asciidoctor' step to create a wrapper script to add required arguments when `hugo` makes the syscall to invoke asciidoctor. The path is updated in the 'Build' step to ensure the customized asciidoc script is used by `hugo`.

Take a look at [the build output for these steps](https://github.com/gameontext/gameontext.github.io/commit/21f8594e9570b42ed21ae2118cf79853d2b405c1/checks?check_suite_id=391257554)

I'll stop here for now. The next bit of work is all about setting up the base set of templates I'll need.
