---
aliases:
  - /articles/24/gentoo-and-an-ibm-t60p-part-1-installation-and-x
tags:
  - linux-gentoo
  - hardware-thinkpad
title: 'Gentoo and an IBM T60p - Part 1: Installation and X'
---
{{< raw_html >}}
<p>Got a new T60 <strong>yay!</strong>, here's my brain dump on getting it to work with gentoo (2006.1).</p>

<p>See also (Updated as new parts are added):</p>

<ul>
	<li><a href="/2007/01/05/gentoo-and-an-ibm-t60p-part-2-dual-boot-ntfs.html">Part 2: <span class="caps">NTFS</span></a></li>
	<li><a href="/2007/01/05/gentoo-and-an-ibm-t60p-part-3-networking.html">Part 3: Networking</a></li>
</ul>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<h3>General 'fo:</h3>

<table>
	<tr>
		<td>Motherboard: 	</td>
		<td>Lenovo ThinkPad T60 2613EJU<sup id="fnrev21131636054fd685f89dc07" class="footnote"><a href="#fn21131636054fd685f89dc07">1</a></sup></td>
	</tr>
	<tr>
		<td>Processor:  	</td>
		<td>Intel Core Duo T2600 (2.16GHz)<sup id="fnrev15003744444fd685f89de7a" class="footnote"><a href="#fn15003744444fd685f89de7a">2</a></sup></td>
	</tr>
	<tr>
		<td>Memory: 	</td>
		<td>2 &#215; 1G DDR2</td>
	</tr>
	<tr>
		<td>Graphics Card: </td>
		<td><span class="caps">ATI</span> Mobility FireGL 256MB</td>
	</tr>
	<tr>
		<td>Hard Drives: 	</td>
		<td>100GB <span class="caps">SATA</span> 7200RPM</td>
	</tr>
	<tr>
		<td>Sound Card:    </td>
		<td>Intel (ICH7) : <span class="caps">ALSA</span> hda-intel<sup id="fnrev16564309884fd685f89e634" class="footnote"><a href="#fn16564309884fd685f89e634">3</a></sup></td>
	</tr>
	<tr>
		<td>Wired:         </td>
		<td>Intel Corp. 82573L Gigabit</td>
	</tr>
	<tr>
		<td>Wireless:      </td>
		<td>Atheros Communications AR5212 <span class="caps">NIC</span></td>
	</tr>
</table>

<h3>Installation</h3>

<p>I followed the general install instructions for gentoo; no rocket science here. I used 2006.1/desktop profile, which sets a lot of handy use flags for you – what you have to do is unset those you don't want (like gnome or kde). In general, I try to keep the global flags list short(er) – though the default desktop profile pulls a lot of stuff in. I prefer setting use flags per package via the /etc/portage/package.use file.</p>

<blockquote>
	<p>added: acpi directfb dmx fbcon fuse gtk2 hdaps madwifi mmx motif opengl real samba smp sse sse2 svg syslog usb wifi</p>
</blockquote>

<blockquote>
	<p>removed: -arts -apm -esd -gnome -ipv6 -kde -ldap -nls</p>
</blockquote>

<p><em>Note:</em> <code>euse</code> (from gentoolkit) is very useful here. Using <code>euse -i</code> you can tell: a) all of the packages that make use of a given flag and what they use it for, and b) whether or not it's included or excluded from the default profile or from your make.conf. Handy stuff. </p>

<p>I adjusted the grub install for Dual-boot, and did some checking for kernel options: a) <span class="caps">ACPI</span> configuration, b) removing <span class="caps">DRM</span> because of the <span class="caps">ATI</span> chipset (below), etc.</p>

<p>Just for the hell of it, I set up sSMTP to route to my gmail account<sup id="fnrev4313280124fd685f89fc9d" class="footnote"><a href="#fn4313280124fd685f89fc9d">4</a></sup>.</p>

<ul>
	<li>sys-kernel/gentoo-sources-2.6.18-r3</li>
	<li><a href="/files/config-2.6.18-gentoo-r3.txt">kernel .config</a></li>
</ul>

<h3>Pointing devices: </h3>

<p>I decided to add drivers for the touchpad (we'll see how long it lasts – I'll probably end up disabling it via the <span class="caps">BIOS</span>..) and for using the mouse on(in? at?) the console. I didn't need to do anything special aside from emerging the packages (and in the case of gpm, starting the daemon via /etc/init.d/gpm).</p>

<ul>
	<li>x11-drivers/synaptics-0.14.5-r1</li>
	<li>sys-libs/gpm-1.20.1-r5</li>
</ul>

<h3>On-Screen Display and Thinkpad things</h3>

<p>For thinkpad buttons, I use <code>tpb</code> with the <code>xosd</code> use flag to enable on-screen display when you push things (like the volume buttons). After emerging tpb, update <code>/etc/tpbrc</code> per your preferences. Use the <code>hdaps</code> useflag with <code>tm_smapi</code> to enable 1/2 of automatic HD head parking function (the reading-the-data part).</p>

<p>For on-screen display to work w/ X, you have to start tpb when you start X, and it has to have access to the display, etc.</p>

<ul>
	<li>x11-libs/xosd-2.2.14-r1</li>
	<li>app-laptop/tpb-0.6.4</li>
	<li>app-laptop/tp_smapi-0.27</li>
	<li>app-laptop/tpctl-4.17</li>
	<li><a href="/files/tpb.sh">script for starting tpb</a></li>
</ul>

<h3>Setting up X</h3>

<p>This is the fun part. As noted above, the T60 uses an <span class="caps">ATI</span> FireGL graphics chipset, which means binary <span class="caps">ATI</span> drivers<sup id="fnrev19985520194fd685f8a126c" class="footnote"><a href="#fn19985520194fd685f8a126c">5</a></sup>. I grabbed the latest of both <code>ati-drivers</code> and <code>ati-drivers-extra</code> (with <code>~x86</code> for both in /etc/portage/package.keywords). The combination of use flags mentioned above were sufficient for both packages.</p>

<p><em>Note:</em> <code>ati-drivers-extra-8.30.3</code> required libXinerama when the qt use flag is enabled, even if qt did not use that flag. I had to emerge <code>x11-libs/libXinerama</code> for <code>ati-drivers-extra</code> to compile properly.</p>

<p>After emerging the package (followed by <code>source /etc/profile</code> to regen path strings), I copied the <code>xorg.conf.example</code> to <code>xorg.conf</code> (in <code>/etc/X11</code>) and used <code>aticonfig --initial --input=/etc/X11/xorg.conf</code> to create an initial xorg.conf file. Then I updated the file to strip down what was in there – keeping the <span class="caps">ATI</span> stuff, and punting the extra stuff.</p>

<p>Without too much fooling around, X came up (with <span class="caps">DRI</span> and everything). The settings generated by aticonfig left a lot to X11 defaults. 1600&#215;1200 at depth 24:<br />
<pre><code># xdpyinfo | grep resolution -A 1 -B 1
dimensions: 1600x1200 pixels (301x221 millimeters)
resolution: 135x138 dots per inch
depths (7): 24, 1, 4, 8, 15, 16, 32
</code></pre></p>

<p>Now, I did check out <code>sys-apps/ddcxinfo-knoppix</code>, and I have to say it's pretty neat. It spat out all kinds of things about the <span class="caps">TFT</span> display. I've included the output in the list below.</p>

<ul>
	<li>x11-drivers/ati-drivers-8.30.3-r1</li>
	<li>x11-apps/ati-drivers-extra-8.30.3</li>
	<li>x11-base/xorg-x11-7.1</li>
	<li><a href="/files/xorg.conf.t60p">xorg.conf</a></li>
	<li><a href="/files/T60p.ddcxinfo">ddcxinfo-knoppix for T60p <span class="caps">TFT</span> display</a>, <a href="/files/T60p.ddcxinfo.monitor">ddcxinfo-knoppix monitor section</a></li>
</ul>

<p>I did see the following message in Xorg.0.log: <code>(EE) AIGLX error: dlopen of /usr/lib/dri/fglrx_dri.so failed (/usr/lib/dri/fglrx_dri.so: cannot open shared object file: No such file or directory)</code>. According to the <a href="http://www.gentoo.org/proj/en/desktop/x/x11/modular-x-howto.xml">Modular X Migration</a> guide:</p>

<blockquote>
	<p>Note: With modular installed, external drivers such as nvidia-glx and wacom as well as some vnc apps may not work if they install things to <code>/usr/lib/modules</code> instead of <code>/usr/lib/xorg/modules</code>. Many of these will have modular X detection added to the installation process.</p>
</blockquote>

<p>The ati-drivers ebuild does have such detection, and the requested library was installed in the new location (<code>/usr/lib/xorg/modules/dri</code>) however, it looks like the code trying to load the <span class="caps">DLL</span> is still expecting it in the old place?  I tried the most obvious first.. create a symlink from the new location to the old. That seemed to really open things up.</p>

<pre><code># glxinfo
direct rendering: Yes
server glx vendor string: SGI
server glx version string: 1.2
...
client glx vendor string: ATI
client glx version string: 1.3
...
OpenGL vendor string: ATI Technologies Inc.
OpenGL renderer string: ATI MOBILITY FireGL V5200 Pentium 4 (SSE2) (FireGL) (GNU_ICD)
OpenGL version string: 2.0.6119 (8.30.3)
</code></pre>

<p>I still, however, saw an error message: <code>AIGLX error: dlsym for __driCreateNewScreen_20050727 failed (/usr/lib/dri/fglrx_dri.so: undefined symbol: __driCreateNewScreen_20050727</code>. This seems not to harm anything, and the screen is so darn beautiful I just want to use it for awhile.</p>

<h3>Sound</h3>

<p>Why not. Sound next. In the kernal config, I enabled support for <span class="caps">ALSA</span> as modules. I enabled Intel HD Audio PCI Driver for the kernel-based hda-intel module. I didn't have to set up any of the dmix stuff I used to, as (I seem to remember reading) that's all built in these days. Everything "appears to function" right out of the box. Goodness!</p>

<ul>
	<li>media-sound/alsa-utils-1.0.13</li>
	<li>media-libs/alsa-oss-1.0.12</li>
</ul>

<h3>Footnotes / References :</h3>

<p id="fn21131636054fd685f89dc07" class="footnote"><sup>1</sup> <a href="http://www-307.ibm.com/pc/support/site.wss/document.do?sitestyle=lenovo&amp;lndocid=MIGR-62487">Overview – ThinkPad T60, T60p</a></p>

<p id="fn15003744444fd685f89de7a" class="footnote"><sup>2</sup> <a href="http://support.intel.com/support/notebook/centrino/duo/">Intel&#174; Centrino&#8482; Duo Mobile Technology</a><br />
<a href="http://processorfinder.intel.com/details.aspx?sSpec=SL8VN">Intel&#174; Core&#8482; Duo processor T2600</a></p>

<p id="fn16564309884fd685f89e634" class="footnote"><sup>3</sup> <a href="http://www.alsa-project.org/alsa-doc/doc-php/template.php?company=Intel&amp;card=ICH+southbridge+HD-audio+and+modem.&amp;chip=ICH6%2C+ICH6M%2C+ICH7%2C+ESB2&amp;module=hda-intel"><span class="caps">ALSA</span>: hda-intel</a></p>

<p id="fn4313280124fd685f89fc9d" class="footnote"><sup>4</sup> <a href="http://gentoo-wiki.com/HOWTO_Gmail_and_sSMTP"><span class="caps">HOWTO</span> Gmail and sSMTP</a></p>

<p id="fn19985520194fd685f8a126c" class="footnote"><sup>5</sup> <a href="http://odin.prohosting.com/wedge01/gentoo-radeon-faq.html#1_whyuse">Gentoo <span class="caps">ATI</span> Radeon <span class="caps">FAQ</span></a></p>

<p id="fn6" class="footnote"><sup>6</sup> <a href="http://www.mozilla.org/unix/dpi.html">Mozilla Font Size / <span class="caps">DPI</span> Issues</a></p>

<h3>Other References (of course):</h3>

<ul>
	<li><a href="http://tuxmobil.org/centrino.html">Linux on Intel&#174; Centrino&#8482; and Centrino-Duo&#8482; Laptops and Notebooks</a></li>
	<li><a href="http://tuxmobil.org/ibm.html">Linux Laptop and Notebook Installation Survey: <span class="caps">IBM</span>/Lenovo</a></li>
</ul>

<ul>
	<li><a href="http://www.hardwareinreview.com/cms/content/view/49">Lenovo ThinkPad T60p review</a></li>
	<li><a href="http://thinkwiki.org/wiki/Category:T60p">Category:T60p</a></li>
	<li><a href="http://zachtib.com/?p=19">The new Thinkpad T60p</a></li>
	<li><a href="http://buzzy.tesuji.org/thinkpad_t60p.html">Gentoo Linux on the Thinkpad T60p</a></li>
	<li><a href="http://www.thinkwiki.org/wiki/Installation_instructions_for_the_ThinkPad_T60p">Installation instructions for the ThinkPad T60p</a></li>
	<li><a href="http://www.thinkwiki.org/wiki/HDAPS"><span class="caps">HDAPS</span></a>
<ul>
	<li><a href="http://www.thinkwiki.org/wiki/How_to_protect_the_harddisk_through_APS">How to protect the harddisk through <span class="caps">APS</span></a></li>
</ul></li>
	<li><a href="http://gentoo-wiki.com/HOWTO_ALSA_sound_mixer_aka_dmix" title="Complete, include sound mixer"><span class="caps">HOWTO</span> Alsa</a></li>
	<li><a href="http://www.infinitephoto.com/pages/dpi.htm"><span class="caps">DPI</span> and File Size calculator/formulas</a></li>
</ul>

<p><em>2007-01-05: Updated to make all linked files work (missed uploading a few), added link to Parts 2 and 3.</em></p>
{{< /raw_html >}}
