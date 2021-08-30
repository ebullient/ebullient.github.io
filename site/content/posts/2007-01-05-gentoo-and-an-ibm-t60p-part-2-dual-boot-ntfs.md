---
aliases:
  - /articles/27/gentoo-and-an-ibm-t60p-part-2-dual-boot-ntfs
tags:
  - linux-gentoo
  - hardware-thinkpad
title: 'Gentoo and an IBM T60p - Part 2: Dual Boot / NTFS'
---
{{< raw_html >}}
<p>I have what I tried below, but I eventually dropped the attempt. The Lenovo modules hung up <span class="caps">VMW</span>are any time I tried to boot it that way, and while I could mount the <span class="caps">NTFS</span> partition used by WinXP R/W with the tools below, I could not easily get WinXP to look at the lion's share of the drive. (My fault, really – if I weren't so attached to other filesystem types, I could probably have made this work).</p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<h3>Dual Boot</h3>

<p>My new-fangled laptop comes with XP Pro, and I don't have disks for re-installing that OS from scratch (in <span class="caps">VMW</span>are, for example). So, as an experiment, I decided to resize the WinXP partition, and put gentoo on the lion's share of the drive. I want to see if I can get a dual-boot OR <span class="caps">VMW</span>are image running off of that same base – because I think that would be cool<sup id="fnrev7048958234fd685f22dbf8" class="footnote"><a href="#fn7048958234fd685f22dbf8">1</a></sup>. File access would be interesting – but that's another story; I want to see if it will work, first. As part of that effort, I also added support for R/W <span class="caps">NTFS</span><sup id="fnrev422670574fd685f22dc27" class="footnote"><a href="#fn422670574fd685f22dc27">2</a></sup>.</p>

<ul>
	<li>sys-fs/ntfsprogs-1.13.1</li>
</ul>

<p>While poking around, I read up on <span class="caps">NTFS</span><sup id="fnrev21372720164fd685f22e6a2" class="footnote"><a href="#fn21372720164fd685f22e6a2">3</a></sup> – and I think, based on the interoperability section, that I'll also look into ntfs-3g. Note that this requires the freshest version of fuse, which means: don't compile <span class="caps">CONFIG</span>_FUSE_FS into your kernel. Either compile it as a module, or leave it out entirely.</p>

<ul>
	<li>sys-fs/fuse-2.6.0</li>
	<li>sys-fs/ntfs3g-0.20061115-r1</li>
</ul>

<h3>Footnotes / References :</h3>

<p id="fn7048958234fd685f22dbf8" class="footnote"><sup>1</sup> <a href="http://www.geocities.com/epark/linux/grub-w2k-HOWTO.html">Dual-boot with Grub</a> <span class="attribute">[<a href="http://www.geocities.com/epark/linux/">geocities.com/epark/linux/</a>]</span> , and <a href="http://news.u32.net/articles/2006/07/18/running-vmware-on-a-physical-partition">Running <span class="caps">VMW</span>are on a Physical Partition</a></p>

<p id="fn422670574fd685f22dc27" class="footnote"><sup>2</sup> <a href="http://gentoo-wiki.com/HOWTO_NTFS_write_with_ntfsmount"><span class="caps">HOWTO</span> <span class="caps">NTFS</span> write with ntfsmount</a> <span class="attribute">[<a href="http://gentoo-wiki.com/">gentoo-wiki.com</a>]</span></p>

<p id="fn21372720164fd685f22e6a2" class="footnote"><sup>3</sup> <a href="http://en.wikipedia.org/wiki/NTFS"><span class="caps">NTFS</span></a> :wiki:</p>
{{< /raw_html >}}
