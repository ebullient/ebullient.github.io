---
aliases:
  - /articles/49/dns-323-initial-set-up
tags:
  - backup
  - hardware-nas
title: 'DNS-323: Initial set-up'
---
{{< raw_html >}}
<p>I purchased (a shamefully long time ago, welcome to tech live as a mom with a toddler) a DNS-323 (and two 1T drives) with the hope of moving most of our shared files onto it.  Now that we don't record TV shows anymore, having that box on all the time is just a power drain. So: the goal is a DNS-323 with all of our files (photos, music, finance stuff, some movies, etc.) onto the first volume of that drive, and then using an rsync shadow with hardlinks to do nightly backups to the second drive. Some RAID configurations have been reported as less than stable, and using a mirror configuration requires both drives to be active: a nightly rsync backup will do.
</p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<h3>Applying firmware and extra software</h3>
<p>
A <a href="http://www.dlink.com/products/default.aspx?pid=DNS-323&amp;tab=3">firmware update</a> became available between when I bought the unit and when I finally got a chance to work on it-- so I updated the firmware to 1.08, and installed the optional NFS package, though I haven't set NFS up yet.
</p><blockquote>
Firmware
<ol>
<li>Download the firmware update (as a zip) from dlink.com (under "Support Resources")</li>
<li>Unzip the download</li>
<li>Using the Web UI, go to the Tools tab, select Firmware from the left-hand menu</li>
<li>Use the browse button to find the firmware update (dns323_firmware_108 in my case)</li>
<li>Use the apply button (which is in the text above the form, oddly enough) to apply the firmware update</li>
</ol>
Additional Software / NFS update
<ol>
<li>Download the additional software package from dlink.com (under "Additional Downloads")</li>
<li>Unzip the download</li>
<li>Using the Web UI, go to the Advanced tab, and select "ADD-ONS"</li>
<li>Browse to the unzipped file using the appropriate form (Application Pack, in my case, with the file dns323_NFS _Package_v1.00)</li>
<li>Use the apply button to install the software: it will show up in the table below (in the case of the application pack, anyway), and you can toggle the status there (enable/disable via start/stop).</li>
</ol>
</blockquote>
<h3>Setting up funplug, etc.</h3>
<p>
First, install <a href="http://www.inreto.de/dns323/fun-plug/0.5/">fun_plug (v0.5)</a>.
<ul>
<li>I used the Web UI to create a new user, and then used the FTP to transfer fun_plug and fun_plug.tgz to Volume 1 as described <a href="http://wiki.dns323.info/howto:fun_plug">here</a>.</li>
<li>Easy to follow instructions to install additional packages from in the <a href="http://www.inreto.de/dns323/fun-plug/0.5/README.txt">README</a>: <blockquote>
<pre>telnet &lt;your-dns-323&gt;
cd /mnt/HD_a2
rsync -av inreto.de::dns323/fun-plug/0.5/packages .
cd packages
funpkg -i *.tgz
</pre></blockquote> That does install all of the additional packages, but <a href="http://wiki.dns323.info/howto:ffp#version_0.5">fonz's how-to</a> recommends, <blockquote><p>There's nothing in the install tarball (fun_plug.tgz) that's not in a package. The simplest way to stay current is to install all the main packages ( http://www.inreto.de/dns323/fun-plug/0.5/packages/ ).</p><p>I suggest to keep a local copy of the packages using rsync (don't forget –delete). Then use 'funpkg -i *.tgz' and 'funpkg -u *.tgz' to install and upgrade. </p></blockquote>So, that's what I did. At the end of the day, I'll be using quite a few of the extra packages anyhow... </li>
</ul>
All of the above was easy enough, and gave me a telnet shell with root access (no password).
</p>
<h4>Fixing the root user</h4>
<p><a href="http://wiki.dns323.info/howto:ffp#version_0.5">fonz's how-to</a> includes a section on "fixing" the root user.
<table>
<tr><td>pwconv</td><td>Ensures we have an /etc/shadow file based on the contents of /etc/passwd</td></tr>
<tr><td>passwd</td><td>Set a password for root</td></tr>
<tr><td>usermod -s /ffp/bin/sh root</td><td>Set the root user's shell to one that won't prompt for an obscure unlock code</td></tr>
<tr><td>pwck</td><td>Sanity check the /etc/passwd file; ignore missing home directories for nobody and admin</td></tr>
<tr><td>grpck</td><td>Sanity check the /etc/group file; ignore bad group names 500/501</td></tr>
<tr><td>login</td><td>Test your changes: verify you can log in with the password you think you set. ;) </td></tr>
</table>
{{< /raw_html >}}
