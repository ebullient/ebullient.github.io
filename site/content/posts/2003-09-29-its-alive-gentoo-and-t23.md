---
date: "2003-09-29T00:00:00Z"
aliases:
- /articles/11/its-alive-gentoo-and-t23
- /archives/000144.php/
tags:
- gentoo
- thinkpad
title: It's Alive!! (Gentoo and T23)
---
{{< raw_html >}}
<p>So a comment on the first of my entries about Gentoo on a T23 reminded me to make an update regarding my now working system...</p>

<p>I also sorted out my <a href="{{ site.baseurl }}{% link _posts/2003-09-22-gentoo-t23-and-vmware.html %}"><span class="caps">VMW</span>are issues</a>.</p>

{{< /raw_html >}}
<!--more-->
{{< raw_html >}}

<p><strong>Kernel Configuration</strong></p>

<p>Here is my <a href="/files/config-2.4.20-gentoo-r7.txt" title="config-2.4.20-gentoo-r7">working kernel configuration</a></p>

<p>Significant points:
<ul>
<li><span class="caps">APM</span> compiled in</li>
<li><span class="caps">ACPI</span> y, with sub-items as modules</li>
<li><span class="caps">PCMCIA</span>/Cardbus support compiled in  (emerged pcmcia-cs with cardbus disabled)</li>
<li><span class="caps">IPSEC</span> as a module</li>
<li>Only the <span class="caps">EEPRO</span> module for <span class="caps">PCI</span> network support</li>
<li>Wireless <span class="caps">PCI</span> and Wireless <span class="caps">PCMCIA</span> and network <span class="caps">PCMCIA</span> support in modules</li>
<li>Only Sound support and <span class="caps">OSS</span> sound support, both as modules. Emerged alsa-driver for sound support.</li>
</ul></p>

<p><strong><span class="caps">VMW</span>are configuration</strong></p>

<p>This kind of sorted itself out.  I spoke to a co-worker, and he said he hadn't had to do anything funny to get <span class="caps">VMW</span>are to stop complaining. So, I deleted /etc/devfs.d/vmware (a file I'd created to recreate the devfs link for vmmon), I removed vmnet and vmmon from /etc/modules.autoload.d/kernel-2.4 (I'd tried a few variations with the two modules here.. ). </p>

<p>I'd forgotten tweaking the <span class="caps">VMW</span>are start-up script to load the vmmon and vmnet modules. When I upgraded the <span class="caps">VMW</span>are-workstation ebuild (because of some minor change), etc-update reminded me, and I scrapped those changes to.  For some reason, with absolutely no intervention on my part, <span class="caps">VMW</span>are now remains configured on it's own. </p>

<p>I probably thought it was having trouble because I was recompiling the kernel between reboots, something extremely unusual for me to do, but something that would cause the vmware modules to complain when they were loaded.</p>

<p><sighs></p>

<p>Everything is smashing, now!</p>
{{< /raw_html >}}
