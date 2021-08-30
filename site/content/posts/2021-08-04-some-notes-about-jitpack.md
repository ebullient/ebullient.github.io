---
title: "Some notes about jitpack"
tags:
  - java
  - jitpack
  - git
  - obsidian
---
I created another weird side project, this one only sort of related to monsters. I do (still) use FightClub5 as a player, and to manage what my players have to deal with / look at for our campaigns. [Obsidian](https://obsidian.md) has started to take over as campaign manager, because encounters are created/set up/and tracked in Roll20.

I have been working with https://github.com/kinkofer/FightClub5eXML/ to stitch together the sources I want for FightClub5 (the source for these XML files in turn is https://5e.tools/, which is pretty good, too).

One thing lead to another, and time passed, and I worked on the Quarkus CLI, and then I had the idea to write my own client that could do all of the steps required (validate the xml, merge/combine/filter with XSLT) and additionally convert the output into markdown.

Happy Happy!

{{< gh_card "ebullient/fc5-convert-cli" >}}

<!--more-->

Oh, right! Jitpack. The point of this post to begin with. To let people try the client, I wanted to make it easy to download, and jitpack does exactly what I need it to.

The part that I always forget is that jitpack treats your github organization as the group id. For lots of maven packages, that isn't the case, but that's the limitation of jitpack magic. I have jitpack setup to recognize my domain (ebullient.dev, or dev.ebullient in package order), but that still means my group-id has to be "dev.ebullient", and not something more creative. 

Jitpack further wants your artifact id to match the repo name (at least, at the top level), which isn't a bad thing.

Assuming group/artifact ids are set to values jitpack will like, and jitpack has access to your repos, it will build a fresh copy the next time someone asks for your resource. Or.. you could use a [GH action](https://github.com/ebullient/fc5-convert-cli/blob/main/.github/workflows/snapshot.yml) to force the refresh. Your call.  