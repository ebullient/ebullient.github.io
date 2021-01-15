---
date: "2010-01-13T00:00:00Z"
aliases:
- /articles/48/amen-for-schedtool
tags:
- linux
title: Amen for schedtool
---
{{< raw_html >}}
<p>How did I not know about this sooner?
</p><p>
Trying to build a particularly large maven project would consume so much CPU that my poor laptop would quit because it was sweating too much.
</p><p>
I used schedtool to set an affinity to only one of the two CPUs available on my dual-core laptop for the shell I used to launch the build, and voila! Things don't get as hot, and my system stays responsive. *phew!*
</p>
<ul>
<li><a href="http://linux.die.net/man/8/schedtool">schedtool</a></li>
</ul>
{{< /raw_html >}}
