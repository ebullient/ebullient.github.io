---
aliases:
  - /articles/12/cdrw-on-ibm-t23-with-gentoo
  - /archives/000179.php/
tags:
  - linux-gentoo
  - hardware-thinkpad
title: CDRW on IBM T23 with Gentoo
---
{{< raw_html >}}
<p>Didn't notice until now that my CD-RW/DVD player wasn't loading properly – you can tell how much I use it, eh? <img alt=";-&#41;" src="/images/smilies/wink2.gif" class="icon" /></p>

<p>I'd already built the kernel with the correct SCSI modules (see references, below). I'd also already added <code>"hdc=ide-scsi"</code> to my grub boot parameters.</p>

{{< /raw_html >}}
<!--more-->
{{< raw_html >}}

<p>What was left was the following:</p>

<p><code>/etc/devfsd.conf:</code></p>

<ol>
<li>uncommented:
<pre><code># Give the cdrw group write permissions to /dev/sg0
# This is done to have non root user use the burner (scan the scsi bus)
REGISTER    ^scsi/host.*/bus.*/target.*/lun.*/generic PERMISSIONS root.cdrw 660</code></pre>
<li>commented out:
<pre><code># Create /dev/cdrom for the first cdrom drive
#LOOKUP     ^cdrom$         CFUNCTION GLOBAL mksymlink cdroms/cdrom0 cdrom
#REGISTER   ^cdroms/cdrom0$ CFUNCTION GLOBAL mksymlink $devname cdrom
#UNREGISTER ^cdroms/cdrom0$ CFUNCTION GLOBAL unlink cdrom</code></pre>
<li>uncommented the following:
<pre><code># Create /dev/cdrw for the first cdrom on the scsi bus
# (change &#8216;sr0' to suite your setup)
LOOKUP      ^cdrw$          CFUNCTION GLOBAL mksymlink sr0 cdrw
REGISTER    ^sr0$           CFUNCTION GLOBAL mksymlink $devname cdrw
UNREGISTER  ^sr0$           CFUNCTION GLOBAL unlink cdrw</code></pre>
</li>
</ol>

<p>Result:</p>

<pre><code># cdrecord -scanbus
Cdrecord 2.01a14 (i686-pc-linux-gnu) Copyright&#169; 1995-2003 Jörg Schilling
Linux sg driver version: 3.1.24
Using libscg version 'schily-0.7'
scsibus0:
    0,0,0  0) &#8216;MATSHITA' &#8216;UJDA720 DVD/CDRW' '1.03' Removable CD-ROM
    0,1,0  1) *
    0,2,0  2) *
    0,3,0  3) *
    0,4,0  4) *
    0,5,0  5) *
    0,6,0  6) *
    0,7,0  7) *
</code></pre>

<p>YAY! <img alt="&#58;-&#41;" src="/images/smilies/grin.gif" class="icon" /></p>

<p>References:</p>

<ul>
<li><a href="http://zeppox.ath.cx/~jackson/stuff/notes/gentoo_cdrw_notes.html">How to get a CD-RW and CDROM working using Gentoo</a></li>
</ol></li>
</ul>
{{< /raw_html >}}
