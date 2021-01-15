---
date: "2015-03-31T00:00:00Z"
aliases:
- /articles/71/crib-notes-ubuntu-1404-badness
tags:
- linux
- ubuntu
title: 'Crib notes: ubuntu 14.04 badness'
source: html
---
{{< raw_html >}}
<p>Woopsie. Somehow, with some update, I managed to screw nvidia up properly, and then in fixing that, I broke symantec antivirus, too. Part of it was that the 14.04 ubuntu headers have moved up, but the kernel was still at an older version, which made dkms pissy, and .. well.</p>

{{< /raw_html >}}
<!--more-->
{{< raw_html >}}

<p>Here is the (probably wrong and redundant, but it worked) list of things I did to fix it:
<ul>
	<li>sudo apt-get remove nvidia*</li>
	<li>sudo apt-get remove (our symantec modules, yours will be named differently)</li>
	<li>sudo apt-get autoremove</li>
	<li>sudo apt-get install linux-image-generic-lts-trusty
<ul>
	<li>This upgrades to the latest linux kernel + tools, which then matched headers I obtained from other updates. Happiness here.</li>
</ul></li>
	<li>sudo apt-get install (symantec modules, again <span class="caps">YMMV</span> with what these are called)</li>
</ul></p>

<p>As it turns out, I didn't bother putting the nvidia drivers back on. The fallback to the intel card was good enough, and I didn't want to go breaking myself again by accident. As this isn't my primary workstation, I have no idea how I got into this mess. Sounds dumb, but I was updating with only half my attention on what I was doing, and then the world broke, and there was a login loop, which turned out to be: <br />
Xlib:   extension &#8220;<span class="caps">GLX</span>&#8221; missing on display &#8220;:0&#8221;.<br />
So. Yea.. busted nvidia drivers. We'll see how we do without. ;)</p>

<ul>
	<li><a href="http://askubuntu.com/questions/451221/ubuntu-14-04-install-nvidia-driver">Q&amp;A with scads of options</a></li>
</ul>
{{< /raw_html >}}
