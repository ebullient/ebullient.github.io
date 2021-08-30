---
aliases:
  - /articles/69/updating-to-yosemite-clean-install-with-a-clever-backup
tags:
  - backup
  - hardware-mac
title: 'Updating to Yosemite: clean install with a clever backup'
source: html
---
{{< raw_html >}}
<p>I upgraded my iMac (which is aging, sadly) to Yosemite while taking a break from work. </p>

<p>I wanted to do a clean install: the drive had two partitions, one an old windows partition that we don't use anymore, and the other was full of crap from years of trying out apps and the migration from Snow Leopard to Lion to Mountain Lion to Mavericks, etc.</p>

<p>I wanted to make a full backup, so I could recover all of my settings and go scrounge around for files that I missed, etc., but I didn't want to clone a drive. I stumbled on these: </p>

<ul>
	<li><a href="http://www.theinstructional.com/guides/disk-management-from-the-command-line-part-3">Disk Management from the Command-Line,</a></li>
	<li><a href="http://osxdaily.com/2012/05/23/create-disk-image-of-mac-hard-drive/">How to create a disk image of an entire mac hard drive</a></li>
</ul>

<p>Can you see my plan? It worked very well.</p>
{{< /raw_html >}}
<!--more-->
{{< raw_html >}}
<p>I did have to boot into recovery mode (I had a bootable <span class="caps">USB</span> drive with the Yosemite installer on it, so I just used that), and I did use the command line instead of working through disk utility, though I believe either would have worked. </p>

<pre>&gt; hdiutil create /Volumes/External-USB/full-backup.dmg -srcdevice /dev/disk0s2</pre>

<p>I did have trouble with the windows partition, but we haven't used it in so long that I just made an image of the Documents &amp; Settings folder, and called it a night.</p>

<p>After wiping the drive and putting Yosemite on, I was able to raid the *.dmg for apps and settings, etc. (I am sure I could have used the data migration utility, but I was trying to ditch the cruft&#8230; so I was selective. I have the dmg to refer to if I find something missing).</p>

<p>Whee!</p>
{{< /raw_html >}}
