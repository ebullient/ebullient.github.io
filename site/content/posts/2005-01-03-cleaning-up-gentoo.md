---
date: "2005-01-03T00:00:00Z"
aliases:
- /articles/22/cleaning-up-gentoo
tags:
- gentoo
title: Cleaning up gentoo...
---

Those distfiles... /usr/portage/distfiles can get pretty big, and cleaning it out periodically can save a lot of disk space. The brute force approach is to just clear out the whole thing, which can be more practical if you have a fast connection. If redownloading what you need is no big deal, then cleaning out distfiles can be the faster way to go.

<!--more-->

Alternatively, there are some scripts floating around to help you clean out the distfiles (and the other uncleaned up crap) for things that aren't currently installed (old versions, etc).

#### References

* [TIP Clean Up Cruft](http://gentoo-wiki.com/TIP_Clean_Up_Cruft) <span class="attribute">[<a href="http://gentoo-wiki.com/">gentoo-wiki.com</a>]</span>

From <span class="attribute">[<a href="http://forums.gentoo.org/">forums.gentoo.org</a>]</span>:

* <a href="http://forums.gentoo.org/viewtopic-t-3011-highlight-distclean.html">Cleaning out stale distfiles</a>
* <a href="http://forums.gentoo.org/viewtopic-t-67849-highlight-distclean.html">Portage Utilities Not in Portage</a>
* <a href="http://gentooexperimental.org/script/repo/list">Experimental Gentoo Scripts</a>
* <a href="http://forums.gentoo.org/viewtopic.php?t=152618&amp;highlight=clean+distfiles">Filesystem cruft script: clean your system, save disk space!</a> <span class="attribute">[<a href="http://forums.gentoo.org/">forums.gentoo.org</a>]</span>
