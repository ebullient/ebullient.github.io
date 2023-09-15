---
title: "Find lost things in Obsidian with the CustomJS plugin"
tags:
  - obsidian
  - customjs
---

[Obsidian](https://obsidian.md) is a lovely note-taking tool that I use for all the things. 
It is flexible and plastic in a really lovely way. 

But over time (or due to overuse of bulk updates in VSCode), you can end up with images that aren't referenced anywhere, or links to images that don't exist (or are not where the note expects them to be).

My first attempt at making a list of lost things used [dataview](https://github.com/blacksmithgu/obsidian-dataview), but I had a few problems with it: it was generally slow to render (not surprising, it was doing a lot), and due to that slowness, the note would flicker when I opened it on my tablet.

In this attempt, I'm using an [invokable scripts](https://github.com/saml-dev/obsidian-custom-js#invocable-scripts) from the [CustomJS](https://github.com/saml-dev/obsidian-custom-js) plugin to update/replace the conent of a note. 

The general idea: I run the script (command), it updates/replaces the contents of a note. I can review that note and decide if unreferenced files should be deleted, or if links need to be fixed, etc. I can run the script again to verify that I've fixed the problem, or I can forget about it until the next time I feel like I should tidy things up.

The [gist](https://gist.github.com/ebullient/9574764676b96530659e4f65945d3392) is shown below the fold (see more).

<!--more-->

{{< gist ebullient 9574764676b96530659e4f65945d3392 >}}
