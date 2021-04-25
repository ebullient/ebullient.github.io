---
aliases:
- /articles/10/gentoo-t23-and-vmware
- /archives/000139.php/
tags:
- gentoo
- thinkpad
title: Gentoo, T23, and VMWare
---
{{< raw_html >}}
<p><a href="http://lindows.prodigydigital.com/tutorials/vmware.html">Why do I have to run vmware-config.pl every time I reboot my computer?</a></p>

<p>This was happening to me, and while that's a lindows tutorial, it hit the nail on the head:</p>

<blockquote><p>Because devfs rebuilds the /dev tree at each reboot, it is likely that your vmnet and vmmon devices will become unavailable. Because those devices are now unavailable, you have to manually run the vmware-config.pl to rebuild them into the existing /dev tree.</p></blockquote>

<p><strong>[UPDATE: 9/29/2004]</strong> This is total hogwash, see <a href="{{ site.baseurl }}{% link _posts/2003-09-29-its-alive-gentoo-and-t23.html %}">here</a></p>

{{< /raw_html >}}
<!--more-->
{{< raw_html >}}

<p>So, I added the vmmon lines to devfs.d/vmware, which should start that part ok. The vmnet nodes are a bit more of a puzzle. One place says put a wrapper around init. I am not brave enough for that, and I'd rather work out the right stuff to have the nodes added by devfs when vmnet is referenced - that would make the most sense to me, anyway.</p>

<p>from devfsd man page:</p>

<blockquote><p><strong><span class="caps">RESTORE </span>directory</strong> This will restore entries previously saved under directory to devfs. Only symbolic links or entries with the sticky bit set will be restored. This action is taken as the configuration file is read. With appropriate <span class="caps">COPY </span>actions, complete persistence is acheived.</p></blockquote>

<p>Will have to look more at that tomorrow, I think that's the only way. getting that damn script to run is not something I want to try, but making a directory that has the vmnet entries in it for devfsd to restore makes more sense.</p>

<p><strong>yawn</strong></p>

<p>References: </p>

<ul>
<li><a href="http://www.atnf.csiro.au/people/rgooch/linux/docs/devfs.html"><span class="caps">DEVFS </span>(Device File System) <span class="caps">FAQ</span></a></li>
<li><a href="http://wiki.sourcemage.org/index.php?page=HOWTO-devfsd+setup"><span class="caps">HOWTO</span>-devfsd</a></li>
<li><a href="http://www.gentoo.org/doc/en/rc-scripts.xml">Gentoo Linux 1.0 Init System</a></li>
<li><a href="http://www-106.ibm.com/developerworks/library/l-fs4.html" title="Introduction to devfs">Common threads: Advanced filesystem implementor's guide, Part 4</a></li>
<li><a href="http://www-106.ibm.com/developerworks/library/l-fs5.html" title="Setting up devfs">Common threads: Advanced filesystem implementor's guide, Part 5</a></li>
</ul>
{{< /raw_html >}}
