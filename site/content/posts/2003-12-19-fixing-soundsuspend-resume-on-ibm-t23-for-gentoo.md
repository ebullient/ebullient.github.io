---
aliases:
  - /articles/13/fixing-soundsuspend-resume-on-ibm-t23-for-gentoo
  - /archives/000180.php/
tags:
  - linux-gentoo
  - hardware-thinkpad
title: Fixing Sound/Suspend-Resume on IBM T23 for Gentoo
---
{{< raw_html >}}
<p><span class="caps">ALSA</span> does work, as I mentioned <a href="/2003/09/21/dammit-gentoo-on-t23-continued.html">here</a>, but it seems to have problems across a suspend-resume, i.e. it doesn't work post-resume.</p>

<p>Previously used patches don't seem to apply to newer Alsa modules.</p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>Gentoo installs apmd_proxy in /etc/apm, with suspend.d and resume.d directories for handling special suspend/resume operations. Even better, event.d handles both.</p>

<p>So, based on some searching around, I ended up adding apmd to the list of services to start (<code>rc-update add apmd default</code>), and added the following script to get alsa to behave on resume:</p>

<blockquote>
<p><b><code>/etc/apm/event.d/alsa:</code></b><br />
<pre>#!/bin/sh

case &quot;$1&quot; in
resume)
    /usr/sbin/alsactl power off
    /usr/sbin/alsactl power on
    ;;
suspend|standby)
    ;;
esac </pre></p>
</blockquote>

<p>Found this lovely snippet that answers why <code>apm -s</code> works better than <code>Fn-F4</code> [emphasis added]:</p>

<blockquote>
<p>The <span class="caps">APM</span> <span class="caps">BIOS</span> rejects suspend (or hibernate) requests under certain conditions: e.g., on my TP600, when my Xircom Ethernet/modem card is inserted and the machine is on AC power. If I do <code>apm —suspend</code> then the kernel apm driver hears about the request first and tells apmd which runs apmd_proxy which runs the scripts in
<code>/etc/apm/event.d</code> which do things like eject the <span class="caps">PCMCIA</span> cards; only then does the apm driver pass the request on to the <span class="caps">BIOS</span>. (I think.) If I do <code>tpctl —suspend</code> on the other hand, the <span class="caps">BIOS</span> hears about the request first and, <em>if the <span class="caps">PCMCIA</span> card is still inserted, it rejects the request with a couple of beeps (high—-low).</em>  <code>apm —suspend</code> is therefore to be preferred to <code>tpctl —suspend</code>.</p> Unfortunately, there is no alternative to
<code>tpctl —hibernate</code> : the apm program and the kernel apm driver don't know how to ask for hibernation. Solution: write a little script that does <code>cardctl eject ; tpctl —hib</code>. <code>Fn-F4</code> does the same as <code>tpctl —suspend</code> and <code>Fn-F12</code> does the same as <code>tpctl —hibernate</code>.
</blockquote>

<p>The mention of the <span class="caps">BIOS</span> rejecting the suspend request when a <span class="caps">PCMCIA</span> card is inserted is exactly what I was seeing – I'm using my wireless card right now.</p>

<p>So after all that, I learned that I should suspend using <code>apm -s</code> and not with the thinkpad buttons if I have a pcmcia card active. With no <span class="caps">PCMCIA</span> card, the suspend request will be handled correctly by <span class="caps">APM</span> and apmd, and everything should be happy. </p>

<p><strong>References:</strong></p>

<ol>
<li><a href="http://www.linux-thinkpad.org/FAQ/cache/32.html">Why doesn't my Thinkpad hibernate? | Linux-ThinkPad <span class="caps">FAQ</span></a></li>
</ol>

<p>Various records of Linux Installation attempts:</p>

<ol>
<li><a href="http://www.loria.fr/~stuber/t30/debian-ibm-t30-2366-085.html">How to set up an <span class="caps">IBM</span> Thinkpad T30 Debian <span class="caps">GNU</span>/Linux</a></li>
<li><a href="http://www.open-organizations.org/view/Socialtools/LinuxOnThinkpadT23">Debian <span class="caps">GNU</span>/Linux on an <span class="caps">IBM</span> Thinkpad T23</a></li>
<li><a href="http://www.geocities.com/dirk_wetter/thinkpad/tp_suse8/index.html#s">Linux on A30p – Sound</a></li>
<li><a href="http://www.biplane.com.au/~kauer/miscellaneous/ibmt30-notes.html">SuSE Linux 8.0 on <span class="caps">IBM</span> T30 Thinkpad</a></li>
<li><a href="http://lists.debian.org/debian-devel/2000/debian-devel-200007/msg01108.html">Re: ThinkPad 600, kernel 2.2.17pre6, and hibernation</a></li>
<li><a href="http://mailman.linux-thinkpad.org/pipermail/linux-thinkpad/2001-March/004174.html" lang="ltp"><span class="caps">APMD</span> and Standby on the TP-T21</a></li>
<li><a href="http://article.gmane.org/gmane.linux.gentoo.user/35506" title="was Re: [gentoo-user] Laptop + Gentoo">artsshell permissions</a></li>
</ol>

<p>Older Alsa drivers:</p>

<ol>
<li><a href="http://www.alex.org.uk/T23/">Installing &amp; Running Linux on an <span class="caps">IBM</span> T23 Laptop</a></li>
<li><a href="http://static.linuxcare.com/certs/intel8x0.diff">Patch to cards/card-intel8&#215;0.c for suspend/resume</a></li>
</ol>

<p>Information for Linux on <span class="caps">IBM</span> Laptops</p>

<ol>
<li><a href="http://www9.linuxcare.com/">LinuxCare</a> – <a href="http://www9.linuxcare.com/labs/certs/ibm/thinkpad/t23/"><span class="caps">IBM</span> T23 certification</a></li>
<li><a href="http://www.linux-on-laptops.com/ibm.html">Linux on <span class="caps">IBM</span> Laptops</a></li>
<li><a href="http://www.linux-thinkpad.org/FAQ/">Linux-ThinkPad <span class="caps">FAQ</span></a></li>
</ol>

<p><span class="caps">APM</span> / Other tools</p>

<ol>
<li><a href="http://www.worldvisions.ca/~apenwarr/apmd/" title="Version 3.0.2">The Linux <span class="caps">APM</span> Daemon</a></li>
<li><a href="http://www.miketaylor.org.uk/tech/deb/">deb2targz</a></li>
</ol>

<p>Everywhere I looked, things would reference debian's <code>/etc/apm/event.d/alsa</code> script. Thing is, I don't run debian, and I'll be damned if I could find the contents of the script anywhere. </p>

<p>For future reference, I've attached the source <a href="/files/alsa">here</a>.</p>
{{< /raw_html >}}
