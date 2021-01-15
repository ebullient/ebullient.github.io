---
title: Gentoooooooooooooooooooooo
date: "2003-09-16T00:00:00Z"
aliases:
- /articles/7/gentoooooooooooooooooooooo
- /archives/000130.php
tags:
- gentoo
- thinkpad
---
Jimminy Christmas!

Everything was paddling along smoothly until I hit this little hiccup, I've got an ATI RADEON card, which is apparently a whole pile of badness.

Thank goodness some punks have figured this crap out before me!

<!--more-->
Gentoo Install (the chicken-shit I've never done this before way):

1. Follow the [docs](http://gentoo.org/doc/en/gentoo-x86-install.xml) till you're blue in the face, specifically:

    * stage 3 install
    * get beginning packages from CD's saves some time
    * in `/etc/make.conf`, set some USE vars: `radeon gnome gtk2 -kde -qt mysql -ldap`
    * timezone `EST5EDT`
    * use genkernel for compile with caveat – I have a stupid radeon, so run genkernel-config, and turn agpgart on, but DRM off:

      ```
      Processor type and features—>
      <*> MTRR (Memory Type Range Register) support
      Character devices—>
      <*> /dev/agpgart (AGP Support)
      [*] all chipsets compiled into kernel (just to be safe)
      [ ] Direct Rendering Manager (XFree86 DRI support)
      ```

    * continue with above instructions, get xfree-drm

2. cancel the middle of an emerge only if you're ready to do some serious patchwork. Basically, don't start unless you're ready to finish.

3. not done yet, I'll let you know

See [Hardware 3D Acceleration Guide](http://www.gentoo.org/doc/en/dri-howto.xml), which seems to be a more official version of
[Gentoo Forums :: View topic - Direct rendering (DRI) using XFree-DRM HOWTO](http://forums.gentoo.org/viewtopic.php?t=46681)
