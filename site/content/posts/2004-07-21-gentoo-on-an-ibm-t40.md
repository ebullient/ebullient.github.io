---
aliases:
- /articles/18/gentoo-on-an-ibm-t40
tags:
- gentoo
- thinkpad
title: Gentoo on an IBM T40
source: html
---
{{< raw_html >}}

<p>So, I have gentoo up and running on my T40, and thought I'd share the resources that helped me get there.</p>

<p>For those interested, here's the currently running kernel <a href="/files/config-2.6.7-gentoo-r11" title="2.6.7-gentoo-r11">config</a>.</p>

{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p><em><strong>Preparation:</strong></em><br />
I wiped the predesktop area. I don't plan on running windows, and I'd rather have the disk space, thanks.</p>

<p><em><strong>2.6 Kernel / Modules:</strong></em></p>

<ul>
	<li><strong>Power Management</strong> – I stuck with <span class="caps">APM</span> rather than <span class="caps">ACPI</span>. I may try <span class="caps">ACPI</span> later, but not yet.</li>
	<li><strong>Graphics Support</strong> – I went with framebuffer support this time, and so far, I like it.<br />
Make sure you compile framebuffer console support <span class="caps">INTO</span> the kernel.</li>
	<li><strong>Sound Support</strong> – Alsa + snd_i8&#215;0, as usual</li>
	<li><strong>Networking</strong>
<ul>
	<li>e1000 driver worked out of the box for the on-board Ethernet card</li>
	<li><strong>There is a new <a href="http://ipw2100.sourceforge.net/">SF project</a> providing a driver for the onboard Intel Corp. <span class="caps">PRO</span>/Wireless <span class="caps">LAN</span> 2100 card.</strong> The driver seems to work fine, I've not been using it long enough to complain.. ;) Also, there is a <a href="http://forums.gentoo.org/viewtopic.php?t=122435&amp;postdays=0&amp;postorder=asc&amp;start=1075&amp;sid=f1d28c7b904951f6d8a4e4ac6368b5b6">nice ebuild</a> for centralizing wireless config. Sweet!
	<ul>
		<li>emerge wireless-tools</li>
		<li>emerge <a href="http://forums.gentoo.org/viewtopic.php?t=122435&amp;postdays=0&amp;postorder=asc&amp;start=1075&amp;sid=f1d28c7b904951f6d8a4e4ac6368b5b6">wireless-config</a></li>
		<li>tweak /etc/conf.d/net and /etc/conf.d/wireless as recommended by wireless-config package<br />
Noteable: associate_test_eth1="MAC" was required to allow dhcp to finish initializing. I also provided wireless dhcp settings in /etc/conf.d/wireless rather than in /etc/conf.d/net.</li>
		<li>/etc/init.d/net.eth1 start</li>
	</ul></li>
	</ul></li>
	</ul>

<pre><code>iwconfig  (before setting any wireless stuff up)
lo        no wireless extensions.
</code>
<code>eth0      no wireless extensions.
</code>
<code>eth1      IEEE 802.11b  ESSID:&quot;&quot;  Nickname:&quot;ipw2100&quot;
          Mode:Managed  Channel:1  Access Point: 00:00:00:00:00:00
          Bit Rate=0kb/s   Tx-Power=32 dBm
          Retry:on   RTS thr=2304 B   Fragment thr:off
          Encryption key:off
          Power Management:off
          Link Quality:0/100  Signal level:-66 dBm  Noise level:-98 dBm
          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0
          Tx excessive retries:0  Invalid misc:0   Missed beacon:0
</code></pre>

	<p><em><strong>lspci</strong></em></p>

<pre><code>0000:00:00.0 Host bridge: Intel Corp. 82855PM Processor to I/O Controller (rev 03)
0000:00:01.0 PCI bridge: Intel Corp. 82855PM Processor to AGP Controller (rev 03)
0000:00:1d.0 USB Controller: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) USB UHCI Controller #1 (rev 01)
0000:00:1d.1 USB Controller: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) USB UHCI Controller #2 (rev 01)
0000:00:1d.2 USB Controller: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) USB UHCI Controller #3 (rev 01)
0000:00:1d.7 USB Controller: Intel Corp. 82801DB/DBM (ICH4/ICH4-M) USB 2.0 EHCI Controller (rev 01)
0000:00:1e.0 PCI bridge: Intel Corp. 82801 PCI Bridge (rev 81)
0000:00:1f.0 ISA bridge: Intel Corp. 82801DBM LPC Interface Controller (rev 01)
0000:00:1f.1 IDE interface: Intel Corp. 82801DBM (ICH4) Ultra ATA Storage Controller (rev 01)
0000:00:1f.3 SMBus: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) SMBus Controller (rev 01)
0000:00:1f.5 Multimedia audio controller: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) AC&#39;97 Audio Controller (rev 01)
0000:00:1f.6 Modem: Intel Corp. 82801DB/DBL/DBM (ICH4/ICH4-L/ICH4-M) AC&#39;97 Modem Controller (rev 01)
0000:01:00.0 VGA compatible controller: ATI Technologies Inc Radeon R250 Lf [Radeon Mobility 9000 M9] (rev 02)
0000:02:00.0 CardBus bridge: Texas Instruments PCI1520 PC card Cardbus Controller (rev 01)
0000:02:00.1 CardBus bridge: Texas Instruments PCI1520 PC card Cardbus Controller (rev 01)
0000:02:01.0 Ethernet controller: Intel Corp. 82540EP Gigabit Ethernet Controller (Mobile) (rev 03)
0000:02:02.0 Network controller: Intel Corp. PRO/Wireless LAN 2100 3B Mini PCI Adapter (rev 04)
</code></pre>

<p><em><strong>References:</strong></em></p>

<ul>
	<li><a href="http://www.cs.utexas.edu/users/walter/geek/linux-t40.html" title="Walter Chang">Linux on the <span class="caps">IBM</span> Thinkpad T40</a></li>
	<li><a href="http://www.ontheedge.ch/t40p.html">Gentoo linux on a Thinkpad T40p</a></li>
	<li><a href="http://bellet.info/laptop/t40.html" title="Fabrice Bellet">Linux on the Thinkpad T40</a></li>
	<li><a href="http://www.enyo.de/fw/hardware/thinkpad/" title="Florian Weimer">Linux on the Thinkpad T40p</a> – <em>includes <span class="caps">ACPI</span> and Multihead X</em></li>
</ul>

<ul>
	<li><a href="http://tpctl.sourceforge.net/">Thinkpad Configuration Tools for Linux</a></li>
	<li><a href="http://news.gmane.org/gmane.linux.hardware.thinkpad">thinkpad-linux archives</a></li>
	<li><a href="http://www.linux-on-laptops.com/ibm.html">linux-on-laptops: <span class="caps">IBM</span></a></li>
	<li><a href="http://ipw2100.sourceforge.net/">Intel&#174; <span class="caps">PRO</span>/Wireless 2100 Driver for Linux</a></li>
	<li><a href="http://forums.gentoo.org/viewtopic.php?t=122435&amp;postdays=0&amp;postorder=asc&amp;start=1075&amp;sid=f1d28c7b904951f6d8a4e4ac6368b5b6">wireless-config ebuild</a></li>
	<li><a href="http://theorie.physik.uni-wuerzburg.de/~arwagner/computer/T41p/">Linux on <span class="caps">IBM</span> T41p</a></li>
</ul>

<p><em><strong>Other Notes:</strong></em></p>

<ul>
	<li><a href="http://www.gentoo.org/doc/en/xorg-config.xml">Gentoo: The X Server Configuration <span class="caps">HOWTO</span></a></li>
  <li><a href="http://www.gentoo.org/doc/en/alsa-guide.xml">Gentoo: Gentoo Linux <span class="caps">ALSA</span> Guide</a></li>
	<li><a href="http://lists.debian.org/debian-laptop/2003/08/msg00120.html">console framebuffer [Solved]</a></li>
	<li><a href="http://bluszcz.jabberpl.org/radeon_dri_howto.txt">radeon <span class="caps">DRI</span> howto</a></li>
	<li><a href="http://gentoo-wiki.com/HOWTO_APM_Suspend">Gentoo: Howto <span class="caps">APM</span> Suspend</a></li>
	<li><a href="http://freedesktop.org/~xorg/X11R6.7.0/doc/xorg.conf.5.html">X.org: xorg.conf (5) manpage</a></li>
	<li><a href="http://forums.gentoo.org/viewtopic.php?t=175419">Gentoo Forums: Linux Memory Management or &#8216;Why is there no free <span class="caps">RAM</span>?'</a> – also, why you may not see some of your <span class="caps">RAM</span> (i.e. amounts over ~800M)</li>
	<li><a href="{{site.baseurl}}{% link _posts/2004-01-20-linuxt23-dual-monitors.html %}/">T23 and Dual Monitors</a></li>
</ul>

<p><em><strong>X Font Server and X11:</strong></em></p>

<p>Finally, an email that concisely explains what the hell &#8216;unix:/7100' actually <span class="caps">DOES</span>&#8230; </p>

<p><a href="http://www.mail-archive.com/linux-il@cs.huji.ac.il/msg15131.html">X Font Problem</a></p>

<blockquote>
	<p>From: Nadav Har'El</p>
	<p>On Mon, Jul 09, 2001, Alexander V. Karelin wrote about
    "Re: X font problem":<br />
&gt; 1. The unix/:-1 thing is very simple. unix stands for transport. / has to<br />
&gt; preceed the hostname. If the host is local, than the column follows the<br />
&gt; slash. And the last part is the number of the port, which for unix<br />
&gt; sockets, is -1. So – if You want to use Your font-server's resources – &gt; first check which transport/port does it serve on. And than add it to the<br />
&gt; fontpath.</p>
	<p>&#8230;</p>
	<p>Anyway, what I'm trying to say is that -1 isn't exactly a port number, but<br />
rather a hint the X server and/or font server use to find this file.<br />
For example, in my Redhat 7.1 installation, I have in XF86CONFIG
            FontPath   &#8220;unix/:7100&#8221; </p>
<p>This 7100 is not a port number, since unix-domain sockets do not have<br />
port numbers (an example where this would have been a port is with the<br />
tcp transport: tcp/somecomputer.com:7100 – see man X(7) for more info).<br />
This 7100 tells X to use the local file:
<ol>
<li>ls -l /tmp/.font-unix/fs7100<br />
srwxrwxrwx    1 xfs      xfs             0 Jul  9 23:15 /tmp/.font-unix/fs7100</li>
</ol></p>
<p>Which the font server (xfs) is listening on. Note the &#8220;s&#8221; in the beggining<br />
of the ls -l line: this says this is a special unix-domain *s*ocket file.</p>
</blockquote>
{{< raw_html >}}
