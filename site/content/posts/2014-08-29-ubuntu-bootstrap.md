---
aliases:
  - /articles/68/ubuntu-bootstrap
tags:
  - linux-ubuntu
title: Bootstrapping ubuntu server on an external drive
source: html
---
<p>I have a new 2TB drive that I am going to use to replace a drive on a much used server that is currently running gentoo (which I have increasingly less time to tend). So. I have this new drive in an external enclosure, and I want to bootstrap it with the new OS without having to do that &#8220;go reboot your computer with a <span class="caps">USB</span> key thing&#8221;. I want my OS on the disk, I want to test that all the services can be coerced to behave the way I need them to behave, and I want to do all this with a minimum of fuss and gymnastics.</p>

<!--more-->

<p>This whole setup is now sitting next to me crunching away, and as it is a combination of my experience bootstrapping gentoo in a chroot, and some of the (off the beaten path) instructions for creating debian chroots, I thought I'd throw them together in one place in case they help someone else out.</p>

<p>So, to get this working (my target is ubuntu trusty (server), and I'm working from ubuntu precise (desktop), you can swap as appropriate):
<ol>
	<li>I am fundamentally lazy, and hate having to type sudo all the time.<br />
<code>sudo /bin/bash</code></li>
	<li>Get your drive configured. <br />
In this case, I'm only going to use a small chunk of the 2TB for the OS so I can get things prepped, and then do some insane moving around of data once I have things going. Use your favorite tool for this, there are lots.</li>
	<li>Mount your target partition where you want it, let's say /mnt/trusty</li>
	<li>Make sure you have <a href="https://wiki.ubuntu.com/DebootstrapChroot">debootstrap</a> <br />
The instructions on the page are good, for me: <br />
<code>apt-get install debootstrap</code>
<ul>
	<li>I did not bother with schroot, because that setup isn't what I'm after. debootstrap is enough.</li>
</ul></li>
	<li>Use debootstrap to bootstrap your new OS on the mounted partition. This is roughly akin to gentoo's stage3 tarball extract: <br />
<code>debootstrap trusty /mnt/trusty http://archive.ubuntu.com/ubuntu/</code><br />
And off it goes setting up the fundamentals of a new/fresh OS installation on your new shiny partition. Fun!</li>
	<li>As it says on the debootstrap page above, there are a few more things you need to do to make this a usable chroot you can then use to set up your new system (install services, test configuration, blahblah)</li>
<ul>
	<li><code>cp -L /etc/resolve.conf /mnt/trusty/etc/</code> — copy the resolv.conf file which contains the <span class="caps">DNS</span> information we need</li>
	<li>Mount certain filesystems so things function properly, namely:
<ul>
	<li><code>mount -t proc proc /mnt/trusty/proc</code></li>
	<li><code>mount -t sysfs sys /mnt/trusty/sys</code></li>
	<li><code>mount --bind /dev /mnt/trusty/dev</code></li>
	<li><code>mount --bind /dev/pts /mnt/trusty/dev/pts</code></li>
</ul></li>
	<li>Chroot into the new file system, so you can then do some stuff.<br />
<code>chroot /mnt/trusty /bin/bash</code></li>
	<li>Start setting up your new OS! Good recommendations: <br />
<code>apt-get update</code>
<ul>
	<li>If you get messages about unknown keys, use the following to rectify, and then run update again: <br />
<code>apt-key adv --keyserver keyserver.ubuntu.com --recv-keys &lt;the number from the message&gt;</code></li>
</ul></li>
</ul>
</ol></p>

<p>Cheers!</p>

<p>p.s. You might also be able to do this from the distribution .iso, a la<br />
<code>debootstrap --arch i386 feisty /mnt/target file:/mnt/iso</code><br />
I didn't try it, so <span class="caps">YMMV</span>
<ul>
	<li><a href="http://wiki.soekris.info/Installing_Ubuntu_7.04_Server_via_debootstrap">Installing Ubuntu 7.04 Server via debootstrap</a></li>
</ul></p>

<p>p.p.s. also:
<ul>
	<li><a href="http://jonnytyers.wordpress.com/2013/01/26/debootstrap-installing-ubuntu-from-ubuntu/">http://jonnytyers.wordpress.com/2013/01/26/debootstrap-installing-ubuntu-from-ubuntu/</a></li>
	<li><a href="https://help.ubuntu.com/community/Installation/FromLinux#Without_CD">https://help.ubuntu.com/community/Installation/FromLinux#Without_CD</a></li>
</ul></p>
