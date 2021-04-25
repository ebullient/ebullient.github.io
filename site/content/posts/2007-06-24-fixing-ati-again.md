---
aliases:
- /articles/43/fixing-ati-again
tags:
- gentoo
- thinkpad
title: Fixing ATI again..
---
{{< raw_html >}}
<p>I'm also rebuilding my T60p in place (meaning I started half of it while chrooted, and have now switched over to the newer half...).</p>

<p>I've run into a new issue loading the dri drivers: AIGLX error: dlopen of /usr/lib/dri/fglrx_dri.so failed (/usr/lib/dri/fglrx_dri.so: undefined symbol: __glXFindDRIScreen). Moving to the latest ati driver seemed to fix that (8.37.6-r1).</p>

<ul>
<li><a href="http://xoomer.alice.it/flavio.stanchina/debian/fglrx-installer.html#configure">ATI Linux drivers for debian</a> has great information around how to configure X11 to work with the proprietary ati drivers.</li>
<li><a href="http://www.thinkwiki.org/wiki/Fglrx">Fglrx - ThinkWiki</a> is a good source for how this stuff all works with thinkpads...</li></ul>
{{< /raw_html >}}
