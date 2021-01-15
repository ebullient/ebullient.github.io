---
date: "2015-12-05T00:00:00Z"
aliases:
- /articles/73/which-gradle
tags:
- mac
- scripts
title: 'Which gradle... '
---
{{< raw_html >}}
<p>I am lazy. My fingers have habits that are sometimes hard to change.</p>

<p>I've learned to type <code>gradle</code>, like all the time. Now I need to use <code>gradlew</code>, and for some reason this is difficult.</p>

<p>So I wrote a script, that I've now aliased (whichGradle is now obviously on my path):<br />
alias gradle='whichGradle'</p>

<p>which just does this: </p>

<pre class="bigblock"><code>if [ -x $PWD/gradlew ]; then
  echo Using $PWD/gradlew
  $PWD/gradlew $@
else
  echo Using `which gradle`
  gradle $@
fi
</code></pre>
{{< /raw_html >}}
