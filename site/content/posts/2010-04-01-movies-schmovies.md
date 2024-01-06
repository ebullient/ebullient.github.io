---
aliases:
  - /articles/50/movies-schmovies
tags:
  - linux
title: Movies schmovies
---
<p>Want to get DVDs playing on the laptop that is running gentoo that I'll only have to use for a few more days before I get a new shiny (purple!) one. I know, makes no sense.. but hey, learning is good, right?
</p><ul>
<li>Use xine-ui. It got the farthest first.</li>
<li>Make sure your <a href="http://linvdr.org/projects/regionset/">region is set</a></li>
<li>Go through the few hoops you need to get raw i/o working. I pegged/tanked RAM w/o raw access -- every player segfaulted as a result (mplayer, xine, vlc). Use the raw device.</li>
<li>If it's an encrypted DVD (and you have libdvdcss installed), I found that I needed to change something in my environment to get it to correctly decrypt the disk: <code>export DVDCSS_METHOD=disc</code> -- I did it on the command line since I was just testing. Setting this finally let the DVD play.. with dropped frames all over the place.. but still.. progress!</li>
<li>And last, but not least, the simplest instruction from <a href="http://www.xine-project.org/faq#discardedskipped">xine's help</a>: change the niceness level of xine.. <code>nice --5 xine</code></li>
</ul>
<p>And poof! movie! with menu! rock on</p>
