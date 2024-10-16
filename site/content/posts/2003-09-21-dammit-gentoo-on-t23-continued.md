---
aliases:
  - /articles/9/dammit--gentoo-on-t23-continued
  - /archives/000137.php/
tags:
  - linux-gentoo
  - hardware-thinkpad
title: Dammit- Gentoo on T23 continued
---
<p>So everything was working flawlessly, and I had to switch over into Mandrake to get something, and when I rebooted to Gentoo again, chaos reigned.</p>

<p>Well, not quite chaos, but several modules were refusing to load, with lots of scary messages about IRQ settings and other hogwash.</p>

<!--more-->

<p>Actually, somehow, with building kernel modules for vmware and alsasound, it seems that module loading got completely hosed – it was trying to load e100, for example, which was a directory name.</p>

<p>So I edited my kernel config and removed dozens of modules for net, and usb and stuff that I didn't want anyway (i.e. ditched uhci.o in favor of usb_uhci.o, ditched the e100.o driver in favor of eepro100.o). Recreating all of the modules MINUS the alsa drivers helped. </p>

<p>I also installed the pcmcia-cs package with USE=&#8221;nocardbus&#8221; since PCMCIA and CardBus support are in the kernel.</p>

<p>After verifying that cleaned up the problem, I re-emerged the alsa-driver&#8230;<br />
had to rmmod the sound drivers that had loaded themselves (so just soundcore remained),  and restarted alsa, and that seemed happy.</p>

<p>Rebooted, and everythign is kaflooey again. Sheeiit.<br />
Dammit, I'm an idjit. I mean really..</p>

<blockquote>
<p>rc-update del alsasound<br />
rc-update add alsasound <strong>boot</strong></p>
</blockquote>

<p>That fixed it, I'd added alsasound as a default starter, which means the modules were being loaded by the autoload process.</p>

<p>And THEN,  it's still borked&#8230;so I removed the extra sound module, i810_sound.o from the /lib/modules&#8230;. /kernel/sound path (where modules are installed, rebooted, and voila! no nastygrams. So, it looks like alsa and the audio drivers were fighting, and bringing a whole bunch o' extra junk into the match.</p>

<p>YEESH</p>

<p>References:</p>

<blockquote>
<p>gentoo bug <a href="http://bugs.gentoo.org/show_bug.cgi?id=23491">24391</a></p>
</blockquote>
